import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Delivery from '../models/Delivery.js';
import PaymentDue from '../models/paymentDue.js';


export const getAllDeliveries = async (req, res, next) => {
  try {

    const filter = { isDeleted: false };

    if (req.user.role === 'STAFF') {
      filter.deliveredByUserId = req.user.userId;
    }

    if (req.query.status) {
      filter.deliveryStatus = req.query.status;
    }

    if (req.query.date) {
      const date    = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.deliveryDate = { $gte: date, $lt: nextDay };
    }

    const deliveries = await Delivery.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries
    });

  } catch (error) {
    next(error);
  }
};


export const getDeliveryById = async (req, res, next) => {
  try {

    const filter = { _id: req.params.id, isDeleted: false };

   
    if (req.user.role === 'STAFF') {
      filter.deliveredByUserId = req.user.userId;
    }

    const delivery = await Delivery.findOne(filter);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.status(200).json({
      success: true,
      delivery
    });

  } catch (error) {
    next(error);
  }
};


export const updateDelivery = async (req, res, next) => {
  try {

    const {
      orderId,
      deliveryDate,
      deliveryStatus,
      reason,
      reasonText
    } = req.body;



    if (!orderId || !deliveryDate || !deliveryStatus) {
      return res.status(400).json({
        success: false,
        message: 'Order, delivery date and delivery status are required'
      });
    }

    if (!['DELIVERED', 'NOT_DELIVERED', 'PENDING'].includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery status'
      });
    }


    if (deliveryStatus === 'NOT_DELIVERED') {
      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Reason is required when delivery is not completed'
        });
      }

      if (reason === 'Other' && !reasonText) {
        return res.status(400).json({
          success: false,
          message: 'Please describe the reason in Reason Text'
        });
      }
    }


    const order = await Order.findOne({
      _id: orderId,
      isActive: true,
      isDeleted: false,
      isDelivered: false    
    }).populate('customerId', 'customerName mobileNumber address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or already delivered'
      });
    }

    let delivery = await Delivery.findOne({ orderId, isDeleted: false });

  

    if (deliveryStatus === 'NOT_DELIVERED') {


      if (delivery) {
       
        delivery.deliveryDate   = deliveryDate;
        delivery.deliveryStatus = 'NOT_DELIVERED';
        delivery.reason         = reason;
        delivery.reasonText     = reasonText || '';
        delivery.deliveredByUserId = req.user.userId;
        await delivery.save();
      } else {
        delivery = await Delivery.create({
          orderId,
          orderNo:           order.orderNo,
          deliveryDate,
          customerId:        order.customerId._id,
          customerName:      order.customerName,
          deliveryAddress:   order.deliveryAddress,
          deliveryStatus:    'NOT_DELIVERED',
          reason,
          reasonText:        reasonText || '',
          deliveredByUserId: req.user.userId
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Delivery status updated — Not Delivered',
        delivery
      });
    }

    for (const item of order.items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for item ${item.productName}`
        });
      }

      if (product.totalQty - item.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productName}. Available: ${product.totalQty}, Required: ${item.quantity}`
        });
      }
    }

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      product.totalQty -= item.quantity;
      await product.save();
    }

   
    order.isDelivered = true;
    await order.save();

    if (delivery) {
      delivery.deliveryDate      = deliveryDate;
      delivery.deliveryStatus    = 'DELIVERED';
      delivery.reason            = '';
      delivery.reasonText        = '';
      delivery.deliveredByUserId = req.user.userId;
      await delivery.save();
    } else {
      delivery = await Delivery.create({
        orderId,
        orderNo:           order.orderNo,
        deliveryDate,
        customerId:        order.customerId._id,
        customerName:      order.customerName,
        deliveryAddress:   order.deliveryAddress,
        deliveryStatus:    'DELIVERED',
        deliveredByUserId: req.user.userId
      });
    }

    const paymentDue = await PaymentDue.create({
      orderId:          order._id,
      orderNo:          order.orderNo,
      deliveryId:       delivery._id,
      customerId:       order.customerId._id,
      customerName:     order.customerName,
      orderTotalAmount: order.orderAmount,
      paidAmount:       0,
      balanceAmount:    order.orderAmount,
      paymentStatus:    'NOT_PAID',
      ownerStaffUserId: req.user.userId
    });

    return res.status(200).json({
      success: true,
      message: 'Delivery marked as Delivered. Stock reduced. Payment Due created.',
      delivery,
      paymentDue: {
        id:               paymentDue._id,
        orderNo:          paymentDue.orderNo,
        orderTotalAmount: paymentDue.orderTotalAmount,
        paymentStatus:    paymentDue.paymentStatus
      }
    });

  } catch (error) {
    next(error);
  }
};


export const deleteDelivery = async (req, res, next) => {
  try {

    const delivery = await Delivery.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    delivery.isDeleted = true;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Delivery record deleted'
    });

  } catch (error) {
    next(error);
  }
};