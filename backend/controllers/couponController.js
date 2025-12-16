import Coupon from "../models/couponModel.js";

/* =========================
   ADMIN – CREATE COUPON
========================= */
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, maxUses } = req.body;

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      maxUses,
    });

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================
   USER – APPLY COUPON
========================= */
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon)
      return res.status(400).json({ success: false, message: "Invalid coupon" });

    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ success: false, message: "Coupon expired" });

    let discount = 0;

    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else {
      discount = (cartAmount * coupon.discountValue) / 100;
    }

    res.json({
      success: true,
      discount: Math.min(discount, cartAmount),
      couponId: coupon._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
