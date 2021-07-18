const Payment = require("../models/payment");

module.exports.consumePayment = async (paymentJsonString) => {
    // publishMessage(JSON.stringify({
    //     paymentId: payment._id,
    //     customerId: payment.customerId,
    //     orderId: payment.orderId, 
    //     productIds: payment.productIds, 
    //     amount: payment.amount
    // }))

    var payment = new Payment(
        JSON.parse(paymentJsonString)
    );

    try {
        await payment.save();
        console.log("payment for order %s saved", payment.orderId)

    }
    catch (err) {
        console.log("failed to save payment data for order %s", payment.orderId)
        console.error(err)
    }
}