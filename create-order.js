const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, currency = 'INR', receipt, description } = req.body || {};
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0 || numeric > 500000) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: 'Payment gateway is not configured on the server' });
    }
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(numeric * 100),
      currency,
      receipt: String(receipt || `nalam-${Date.now()}`).slice(0, 40),
      notes: { product: 'NalamUnavu', description: String(description || '').slice(0, 200) },
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('create-order:', error);
    return res.status(500).json({ error: 'Unable to create payment order' });
  }
};
