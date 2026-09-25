// Stripe webhook — this is the ONLY place subscription status is ever
// written. The frontend or a successful redirect never sets Pro access
// directly; only a verified event from Stripe does.
//
// IMPORTANT: Stripe signature verification requires the raw, unparsed
// request body. The `config.api.bodyParser = false` export below tells
// Vercel's Node.js runtime not to pre-parse this route's body — if your
// Vercel setup doesn't respect that (rare, but possible depending on
// platform version), this route will fail signature verification 100% of
// the time, which is the first thing to check if webhooks aren't landing.
//
// Requires STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET (from the Stripe
// Dashboard's webhook endpoint settings — see README for setup steps).

const Stripe = require('stripe');
const { getDb } = require('./_db');

module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook received but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET not set.');
    return res.status(500).end();
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = getDb();
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await applySubscription(db, userId, sub, session.payment_intent || session.id);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const user = await findUserByCustomer(db, sub.customer);
        if (user) await applySubscription(db, user.id, sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const user = await findUserByCustomer(db, sub.customer);
        if (user) {
          await db.execute({
            sql: `UPDATE users SET subscription_status = 'inactive', subscription_plan = NULL,
                  subscription_end_date = ?, stripe_subscription_id = NULL WHERE id = ?`,
            args: [new Date().toISOString(), user.id]
          });
        }
        break;
      }
      default:
        break; // ignore events we don't act on
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('billing-webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
};

async function findUserByCustomer(db, customerId) {
  const result = await db.execute({ sql: 'SELECT id FROM users WHERE stripe_customer_id = ?', args: [customerId] });
  return result.rows[0] || null;
}

async function applySubscription(db, userId, sub, paymentId) {
  const isActive = sub.status === 'active' || sub.status === 'trialing';
  await db.execute({
    sql: `UPDATE users SET
            subscription_status = ?,
            subscription_plan = ?,
            subscription_start_date = ?,
            subscription_end_date = ?,
            stripe_subscription_id = ?
            ${paymentId ? ', payment_id = ?' : ''}
          WHERE id = ?`,
    args: paymentId
      ? [isActive ? 'active' : 'inactive', 'pro_monthly',
         new Date(sub.current_period_start * 1000).toISOString(),
         new Date(sub.current_period_end * 1000).toISOString(),
         sub.id, paymentId, userId]
      : [isActive ? 'active' : 'inactive', 'pro_monthly',
         new Date(sub.current_period_start * 1000).toISOString(),
         new Date(sub.current_period_end * 1000).toISOString(),
         sub.id, userId]
  });
}
