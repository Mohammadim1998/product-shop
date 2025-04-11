const express = require('express');
const router = express();
const { check } = require('express-validator');

const UserCtrl = require('../controllers/UserCtrl');
const User = require('../models/User');

const userExist= require('../middlewares/userExist');
const isAdmin= require('../middlewares/isAdmin');


// EXPRESS RATE LIMIT
const rateLimit = require('express-rate-limit');
const loginRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  statusCode: 200,
  handler: function (req, res) {
    res.status(429).json({ msg: 'لطفا بعد از 15 دقیقه، دوباره امتحان کنید.' });
  },
});


router.get("/users",isAdmin, UserCtrl.getAllUsers);

router.post("/new-user",loginRegisterLimiter,[
    check("username", "تعداد کارکتر نام کاربری باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("displayname", "تعداد کارکتر نام نمایشی باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("password", "تعداد کارکتر رمز عبور باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("email", "فرمت ایمیل اشتباه است...").isEmail(),
    check("favoriteProducts", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isArray(),
    check("userProducts", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isArray(),
    check("comments", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isArray(),
    check("payments", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isArray(),
    check("cart", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isArray(),
    check("viewed", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isBoolean(),
    check("userIsAcive", "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است...").isBoolean(),
],UserCtrl.registerUser);

router.post("/user-activation-code-again",userExist, UserCtrl.userActivationCodeAgain);

router.post("/login-user",loginRegisterLimiter,[
    check("password", "تعداد کارکتر رمز عبور باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("email", "فرمت ایمیل اشتباه است...").isEmail(),
],UserCtrl.loginUser);

router.post("/update-user/:id", [
    check("username", "تعداد کارکتر نام کاربری باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("displayname", "تعداد کارکتر نام نمایشی باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("email", "فرمت ایمیل اشتباه است...").isEmail(),
    check("email", "لطفا ایمیل دیگری انتخاب کنید...").custom(value => {
        return User.find({
            email: value
        }).then(user => {
            if (user.length > 1) {
                throw ("لطفا ایمیل دیگری انتخاب کنید...");
            }
        });
    }),
    check("username", "لطفا نام کاربری دیگری انتخاب کنید...").custom(value => {
        return User.find({
            username: value
        }).then(user => {
            if (user.length > 1) {
                throw ("لطفا نام کاربری دیگری انتخاب کنید...");
            }
        });
    }),
], isAdmin,UserCtrl.updateUser);
router.post("/update-mini-user/:id", [
    check("displayname", "تعداد کارکتر نام نمایشی باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
    check("password", "تعداد کارکتر رمز عبور باید 8 تا 20 کارکتر باشد...").isLength({ min: 8, max: 20 }),
],userExist, UserCtrl.updateMiniUser);
router.post("/delete-user/:id",isAdmin, UserCtrl.deleteUser);

// for admin
router.get("/get-user/:id",isAdmin, UserCtrl.getOneUserById);
// for user
router.get("/get-user-data",userExist, UserCtrl.getUserDataAccount);
router.get("/get-user-admin-data",isAdmin, UserCtrl.getUserAdminData);

router.post("/search-user", [
    check("email", "فرمت ایمیل اشتباه است...").isEmail(),
], isAdmin,UserCtrl.searchUsers);

router.get("/get-part-of-user-data/:slug",userExist, UserCtrl.getPartOfUserData);
// EMAIL SEND CHANGER
router.post("/update-email-user",userExist, UserCtrl.EmailSendChanger);

router.post("/confirm-user-email",userExist, UserCtrl.confirmEmail);

router.post("/favorite-product",userExist, UserCtrl.favoriteProductMan);
router.post("/cart-managment",userExist, UserCtrl.cartMan);
router.get("/cart-number", UserCtrl.cartNumber);
router.get("/uncheck-payment/:id",isAdmin, UserCtrl.uncheckPayment);
router.get("/uncheck-comment/:id",isAdmin, UserCtrl.uncheckComment);

// FOR DASHBOARD DEFAULT PANEL
router.get("/get-new-items",isAdmin, UserCtrl.getNewItems);

module.exports = router;