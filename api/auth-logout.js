const { clearCookie } = require('./_auth');
module.exports = async (req, res) => {
  res.setHeader('Set-Cookie', clearCookie());
  return res.status(200).json({ loggedOut: true });
};
