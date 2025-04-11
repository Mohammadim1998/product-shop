const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const { validationResult } = require('express-validator');
const axios = require('axios');

const nodemailer = require("nodemailer");





const newPayment = async (req, res) => {
    try {
        const theUser = await User.findById(req.user._id);
        if (!theUser) {
            res.status(401).json({ msg: "کاربر یافت نشد..." })
        } else {
            if (req.body.amount && req.body.amount > 0) {
                let params = {
                    merchant_id: process.env.MERCHANT_CODE,
                    amount: req.body.amount,
                    description: "پرداخت فروشگاه فایل مرن فا",
                    callback_url:` ${process.env.WEBSITE_URL}/payment-result`,
                    metadata: {
                        email: theUser.email,
                        username: theUser.username,
                    }
                };
                // REQUEST TO ZARINPAL
                const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", params);
                if (response.data.data.code == 100) {

                    // LEVEL 1: CREATING NEW PAYMENT
                    const newPayment = {
                        username: theUser.username,
                        email: theUser.email,
                        resnumber: response.data.data.authority,
                        amount: req.body.amount,
                        payed: false,
                        products: req.body.products,
                        viewed: false,
                        createdAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                        updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                    };
                    await Payment.create(newPayment);


                    const newUserData = {};
                    const thePayment=await Payment.findOne({resnumber:newPayment.resnumber});
                    // LEVEL 2: ADDING PAYMENT ID TO USER PAYMENTS
                    const userOldPayments = theUser.payments;
                    const thisPayment = [thePayment._id];
                    const userNewPayments = [...userOldPayments, ...thisPayment];
                    newUserData.payments = userNewPayments;
                    await User.findByIdAndUpdate(req.user._id, newUserData, { new: true });



                    
                    res.status(200).json({ link: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}` });
                } else {
                    res.status(401).json({ msg: "خطا در ارتباط با درگاه پرداخت..." });
                }
            } else {
                res.status(401).json({ msg: "سبد خرید خالی است..." });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.newPayment = newPayment;



const paymentResultCheck = async (req, res) => {
    try {
        const thePayment = await Payment.findOne({ resnumber: req.body.resnumber });
        if (!thePayment) {
            res.status(401).json({ msg: "پرداخت یافت نشد..." })
        } else {
            let params = {
                merchant_id: process.env.MERCHANT_CODE,
                amount: thePayment.amount,
                authority: req.body.resnumber,
            };


            // REQUEST TO ZARINPAL
            const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/verify.json", params)

            if ((response.data.data.code && response.data.data.code == 100)) {
                const theUser = await User.findById(req.user._id);
                const newData = {};

                // LEVEL 1: ADDING PRODUCTS TO USER userProducts
                const userOldProducts = theUser.userProducts;
                const userCart = theUser.cart;
                const userNewProducts = [...userOldProducts, ...userCart];
                newData.userProducts = userNewProducts;


                // LEVEL 2: EMPTY CART
                newData.cart = [];




                // LEVEL 3: UPDATE USER
                await User.findByIdAndUpdate(req.user._id, newData, { new: true });


                // LEVEL 4: ADDING ONE TO PRODUCT buyNumber
                for (let i = 0; i < userCart.length; i++) {
                    const theProduct = await Product.findById(userCart[i]);
                    const newProduct = {
                        buyNumber: theProduct.buyNumber + 1
                    }
                    await Product.findByIdAndUpdate(userCart[i], newProduct, { new: true });
                }



                // LEVEL 5: UPDATING THE PAYMENT
                const newPaymentData = {
                    payed: true,
                    viewed: false,
                    updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                };



                await Payment.findByIdAndUpdate(thePayment._id, newPaymentData, { new: true });
                res.status(200).json({ msg: "به امید موفقیت روز افزون" });

            } else {
                res.status(401).json({ msg: "پرداخت انجام نشده است..." });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.paymentResultCheck = paymentResultCheck;







const getAllPayments = async (req, res) => {
    try {
        if (req.query.pn && req.query.pgn) {
            const paginate = req.query.pgn;
            const pageNumber = req.query.pn;
            const GoalPayments = await Payment.find().sort({ _id: -1 }).skip((pageNumber - 1) * paginate).limit(paginate).select({ email: 1, amount: 1, payed: 1, viewed: 1, updatedAt: 1 });
            const AllPaymentsNum = await (await Payment.find()).length;
            res.status(200).json({ GoalPayments, AllPaymentsNum });
        } else {
            const AllPayments = await Payment.find().sort({ _id: -1 })
            // .select({ resnumber: false });
            res.status(200).json(AllPayments);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getAllPayments = getAllPayments;



const getAllNotViewedPayments = async (req, res) => {
    try {
        if (req.query.pn && req.query.pgn) {
            const paginate = req.query.pgn;
            const pageNumber = req.query.pn;
            const GoalPayments = await Payment.find({viewed:false}).sort({ _id: -1 }).skip((pageNumber - 1) * paginate).limit(paginate).select({ email: 1, amount: 1, payed: 1, viewed: 1, updatedAt: 1 });
            const AllPaymentsNum = await (await Payment.find({viewed:false})).length;
            res.status(200).json({ GoalPayments, AllPaymentsNum });
        } else {
            const AllPayments = await Payment.find().sort({ _id: -1 })
            // .select({ resnumber: false });
            res.status(200).json(AllPayments);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getAllNotViewedPayments = getAllNotViewedPayments;



const updatePayment = async (req, res) => {
    try {
        // EXPRESS VALIDATOR 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ msg: errors.errors[0].msg });
        } else {
            const data = req.body;
            data.username = req.body.username.replace(/\s+/g, '_').toLowerCase();
            data.email = req.body.email.replace(/\s+/g, '_').toLowerCase();
            await Payment.findByIdAndUpdate(req.params.id, data, {
                new: true
            });
            res.status(200).json({ msg: "پرداخت با موفقیت به روز رسانی شد" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.updatePayment = updatePayment;




const deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndRemove(req.params.id);
        res.status(200).json({ msg: "پرداخت با موفقیت حذف شد." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.deletePayment = deletePayment;




const getOnePaymentById = async (req, res) => {
    try {
        const goalPayment = await Payment.findById(req.params.id);

        // FOR ADDING PRODUCTS TO GOALPAYMENT
        const goalPaymentProducts = await Product.find({ _id: { $in: goalPayment.products } })
            .select({ title: 1, slug: 1 });
        goalPayment.products = goalPaymentProducts;


        res.status(200).json(goalPayment);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getOnePaymentById = getOnePaymentById;

