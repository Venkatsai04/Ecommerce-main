import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stats from "../models/statsModel.js";

// 1. Track Visit
const trackVisit = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await Stats.findOne({ date: today });

    if (!stats) {
        stats = new Stats({ date: today, visits: 1 });
    } else {
        stats.visits += 1;
    }
    
    await stats.save();
    res.json({ success: true });
  } catch (error) {
    console.log("Track Visit Error:", error);
    res.json({ success: false });
  }
}

// 2. Get Dashboard Data (DEBUG VERSION)
const getDashboardData = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    
    // console.log(`------ ANALYTICS DEBUG ------`);
    // console.log(`Found ${orders.length} total orders.`);

    let totalEarnings = 0;
    
    orders.forEach((order, index) => {
        // Log the first order to see its structure
        if (index === 0) {
            console.log("Sample Order Data:", {
                id: order._id,
                amount: order.amount,
                totalAmount: order.totalAmount,
                payment: order.payment,
                paymentMethod: order.paymentMethod
            });
        }

        // RELAXED LOGIC: Count if payment is true OR paymentMethod exists (for now)
        // We handle Case Insensitivity for 'cod' vs 'COD'
        const isCOD = order.paymentMethod && order.paymentMethod.toLowerCase() === 'cod';
        const isPaid = order.payment === true;

        if (isPaid || isCOD) {
            // Check both 'amount' and 'totalAmount' fields
            const value = Number(order.totalAmount) || Number(order.amount) || 0;
            totalEarnings += value;
        }
    });

    // console.log(`Calculated Total Earnings: ${totalEarnings}`);
    // console.log(`-----------------------------`);

    const totalOrders = orders.length;
    const totalProducts = await productModel.countDocuments({});
    
    // Total Visits
    const statsData = await Stats.aggregate([
        { $group: { _id: null, totalVisits: { $sum: "$visits" } } }
    ]);
    const totalVisits = statsData.length > 0 ? statsData[0].totalVisits : 0;

    const latestOrders = await orderModel.find({})
        .sort({ createdAt: -1 }) // Use createdAt
        .limit(5);

    res.json({
      success: true,
      stats: {
        totalEarnings,
        totalOrders,
        totalProducts,
        totalVisits
      },
      latestOrders
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getDashboardData, trackVisit };