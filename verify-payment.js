const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing payment verification fields' });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ verified: false, error: 'Payment gateway is not configured on the server' });
    }
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(String(razorpay_signature), 'utf8');
    const verified = a.length === b.length && crypto.timingSafeEqual(a, b);
    res.setHeader('Cache-Control', 'no-store');
    if (!verified) return res.status(400).json({ verified: false, error: 'Payment signature verification failed' });
    return res.status(200).json({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (error) {
    console.error('verify-payment:', error);
    return res.status(500).json({ verified: false, error: 'Unable to verify payment' });
  }
};
