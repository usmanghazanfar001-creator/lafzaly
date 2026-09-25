// POST -> creates a Stripe Checkout session for Lafzaly Pro ($1/month) and
// returns its URL for the browser to redirect to.
//
// Requires STRIPE_SECRET_KEY and STRIPE_PRICE_ID (the Price ID of a $1/month
// recurring Price you create in the Stripe Dashboard — see README).
const Stripe = require('stripe');
const { getSessionUser } = require('./_auth');
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({ error: 'Billing is not configured on the server yet.' });
  }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in first.' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const db = getDb();

    // Reuse an existing Stripe customer for this user if we already made one,
    // so repeat subscriptions/cancellations stay tied to one customer record.
    const existing = await db.execute({ sql: 'SELECT stripe_customer_id FROM users WHERE id = ?', args: [user.id] });
    let customerId = existing.rows[0]?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
      customerId = customer.id;
      await db.execute({ sql: 'UPDATE users SET stripe_customer_id = ? WHERE id = ?', args: [customerId, user.id] });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/?upgraded=1`,
      cancel_url: `${origin}/?upgrade_cancelled=1`,
      metadata: { userId: user.id }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('billing-checkout error:', err);
    return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }
};
