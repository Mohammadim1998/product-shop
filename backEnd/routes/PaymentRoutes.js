const express = require('express');
const router = express();
const { check } = require('express-validator');

const PaymentCtrl = require('../controllers/PaymentCtrl');
const userExist= require('../middlewares/userExist');
const isAdmin= require('../middlewares/isAdmin');


router.get("/payments",isAdmin, PaymentCtrl.getAllPayments);
router.get("/not-viewed-payments", isAdmin,PaymentCtrl.getAllNotViewedPayments);
router.post("/update-payment/:id", [
    check("username", "تعداد کارکتر نام کاربری باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("resnumber", "تعداد کارکتر کد پرداخت باید بیشتر از 15 کارکتر باشد...").isLength({ min: 15 }),
    check("email", "فرمت ایمیل اشتباه است...").isEmail(),
    check("amount", "فرمت مبلغ اشتباه است...").isNumeric(),
    check("payed", "فرمت پرداخت شدن اشتباه است...").isBoolean(),
    check("products", "فرمت محصولات قابل پرداخت اشتباه است...").isArray(),
    check("viewed", "فرمت چک شدن اشتباه است...").isBoolean(),
], isAdmin,PaymentCtrl.updatePayment);
router.post("/delete-payment/:id",isAdmin, PaymentCtrl.deletePayment);
// for admin
router.get("/get-payment/:id",isAdmin, PaymentCtrl.getOnePaymentById);


router.post("/new-payment",userExist, PaymentCtrl.newPayment);
router.post("/payment-result-check",userExist, PaymentCtrl.paymentResultCheck);



module.exports = router;