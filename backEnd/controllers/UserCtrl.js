const User = require('../models/User');
const Product = require('../models/Product');
const Post = require('../models/Post');
const Payment = require('../models/Payment');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");



const getAllUsers = async (req, res) => {
    try {
        if (req.query.pn && req.query.pgn) {
            const paginate = req.query.pgn;
            const pageNumber = req.query.pn;
            const GoalUsers = await User.find().sort({ _id: -1 }).skip((pageNumber - 1) * paginate).limit(paginate).select({ username: 1, displayname: 1, email: 1, viewed: 1, userIsAcive: 1, createdAt: 1 });
            const AllUsersNum = await (await User.find()).length;
            res.status(200).json({ GoalUsers, AllUsersNum });
        } else {
            const AllUsers = await User.find().sort({ _id: -1 }).select({ password: false });
            res.status(200).json(AllUsers);
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getAllUsers = getAllUsers;




// REGISTER USER
const registerUser = async (req, res) => {
    try {
        // EXPRESS VALIDATOR 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ msg: errors.errors[0].msg });
        } else {
            // CHECK PASSWORD EQUAL CONFIRM PASSWORD
            if (req.body.password == req.body.rePassword) {
                // CHECK EMAIL EXISTS
                const emailExist = await User.find({ email: req.body.email });
                if (emailExist.length < 1) {
                    // CHECK USERNAME EXISTS
                    const usernameExist = await User.find({ username: req.body.username });
                    if (usernameExist.length < 1) {
                        // MAKING USER
                        const data = req.body;
                        data.username = req.body.username.replace(/\s+/g, '_').toLowerCase();
                        data.displayname = req.body.displayname.replace(/\s+/g, '_').toLowerCase();
                        data.email = req.body.email.replace(/\s+/g, '_').toLowerCase();
                        data.password = req.body.password.replace(/\s+/g, '').toLowerCase();
                        const hashedPassword = await bcrypt.hash(data.password, 10);
                        // find rand number 8 digits: Math.floor(Math.random() * (max - min + 1) + min)
                        const userActivateCode = Math.floor(Math.random() * (90000000) + 10000000);
                        const newUser = new User({
                            username: data.username,
                            displayname: data.displayname,
                            email: data.email,
                            password: hashedPassword,
                            favoriteProducts: [],
                            userProducts: [],
                            comments: [],
                            payments: [],
                            cart: [],
                            viewed: false,
                            activateCode: userActivateCode,
                            userIsAcive: false,
                            emailSend: true,
                            createdAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                        });

                        newUser.save()
                            .then(d => {
                                // MAKING AUTH COOKE
                                const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.TOKEN_SECRET);

                                // EMAIL TO USER ACCOUNT
                                const MAIL_HOST = process.env.MAIL_HOST;
                                const MAIL_PORT = process.env.MAIL_PORT;
                                const MAIL_USER = process.env.MAIL_USER;
                                const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
                                const MAIL_MAIN_ADDRESS = process.env.MAIL_MAIN_ADDRESS;

                                const transporter = nodemailer.createTransport({
                                    host: MAIL_HOST,
                                    port: MAIL_PORT,
                                    tls: true,
                                    auth: {
                                        user: MAIL_USER,
                                        pass: MAIL_PASSWORD
                                    }
                                });

                                transporter.sendMail({
                                    from: MAIL_MAIN_ADDRESS,
                                    to: newUser.email,
                                    subject: "احراز هویت فروشگاه فایل مرن فا",
                                    html: `<html><head><style>strong{color: rgb(0, 119, 255);}h1{font-size: large;}</style></head><body><h1>احراز هویت فروشگاه فایل مرن فا</h1><div>کد احراز هویت: <strong>${userActivateCode}</strong></div></body></html>`
                                })
                                    .then(d => {
                                        res.status(200).json({ msg: "ثبت نام موفقیت آمیز بود.", auth: token });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400).json({ msg: "خطا در ثبت نام", errorMessage: err, });
                                    });

                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            })
                    }
                    else {
                        res.status(422).json({ msg: "لطفا نام کاربری دیگری وارد کنید." });
                    }
                }
                else {
                    res.status(422).json({ msg: "لطفا ایمیل دیگری وارد کنید." });
                }
            }
            else {
                res.status(422).json({ msg: "تکرار رمز عبور اشتباه هست." });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.registerUser = registerUser;





// SEND USER ACTIVATION CODE AGAIN
const userActivationCodeAgain = async (req, res) => {
    try {
        const userData = await User.findById(req.user._id);


        if (userData.activateCodeSendingNumber > 0) {
            const newData = {
                activateCodeSendingNumber: userData.activateCodeSendingNumber - 1,
            }
            await User.findByIdAndUpdate(req.user._id, newData, { new: true });


            // EMAIL TO USER ACCOUNT
            const MAIL_HOST = process.env.MAIL_HOST;
            const MAIL_PORT = process.env.MAIL_PORT;
            const MAIL_USER = process.env.MAIL_USER;
            const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
            const MAIL_MAIN_ADDRESS = process.env.MAIL_MAIN_ADDRESS;

            const transporter = nodemailer.createTransport({
                host: MAIL_HOST,
                port: MAIL_PORT,
                tls: true,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASSWORD
                }
            });

            transporter.sendMail({
                from: MAIL_MAIN_ADDRESS,
                to: userData.email,
                subject: "ایمیل دوباره برای احراز هویت فروشگاه فایل مرن فا",
                html: `<html><head><style>strong{color: rgb(0, 119, 255);}h1{font-size: large;}</style></head><body><h1>ایمیل دوباره برای احراز هویت فروشگاه فایل مرن فا</h1><div>کد احراز هویت: <strong>${userData.activateCode}</strong></div></body></html>`
            })
                .then(d => {
                    res.status(200).json({ msg: "ایمیل با موفقیت دوباره ارسال شد." });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: "خطا در ارسال دوباره ایمیل", errorMessage: err, });
                });
        }
        else {
            res.status(401).json({ msg: "شما امکان ارسال دوباره ایمیل را ندارید..." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.userActivationCodeAgain = userActivationCodeAgain;




// LOGIN USER
const loginUser = async (req, res) => {
    try {
        // EXPRESS VALIDATOR 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ msg: errors.errors[0].msg });
        } else {
            // CHECK EMAIL EXISTS
            const the_goal_email=req.body.email.toLowerCase();
            const emailExist = await User.find({ email:the_goal_email  });
            
            if (emailExist.length > 0) {
                const theUser = emailExist[0];
                const data = req.body;
                data.email = req.body.email.replace(/\s+/g, '_').toLowerCase();
                data.password = req.body.password.replace(/\s+/g, '').toLowerCase();

                const validPassword = await bcrypt.compare(data.password, theUser.password);
                if (validPassword == false) {
                    res.status(422).json({ msg: "ایمیل یا رمز عبور اشتباه است." });
                } else {
                    // MAKING AUTH COOKE
                    const token = jwt.sign({ _id: theUser._id, username: theUser.username }, process.env.TOKEN_SECRET);
                    res.status(200).json({ msg: "با موفقیت وارد حساب کاربری شدید.", auth: token });
                }
            }
            else {
                res.status(422).json({ msg: "لطفا ثبت نام کنید." });
            }

        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.loginUser = loginUser;




const updateUser = async (req, res) => {
    try {
        // EXPRESS VALIDATOR 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ msg: errors.errors[0].msg });
        } else {
            const data = req.body;
            data.username = req.body.username.replace(/\s+/g, '_').toLowerCase();
            data.displayname = req.body.displayname.replace(/\s+/g, '_').toLowerCase();
            data.email = req.body.email.replace(/\s+/g, '_').toLowerCase();
            await User.findByIdAndUpdate(req.params.id, data, {
                new: true
            });
            res.status(200).json({ msg: "کاربر با موفقیت به روز رسانی شد" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.updateUser = updateUser;



const updateMiniUser = async (req, res) => {
    try {
        // EXPRESS VALIDATOR 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ msg: errors.errors[0].msg });
        } else {
            if (req.body.username || req.body.email || req.body.payments || req.body.userProducts || req.body.activateCode || req.body.viewed || req.body.userIsAcive) {
                res.status(400).json({ msg: "خطا در اطلاعات فرستاده شده..." });
            } else {
                if (req.body.password == req.body.rePassword) {
                    const data = req.body;
                    data.displayname = req.body.displayname.replace(/\s+/g, '_').toLowerCase();

                    const newPass = req.body.password.replace(/\s+/g, '').toLowerCase();
                    data.password = await bcrypt.hash(newPass, 10);

                    data.updatedAt = new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' });

                    await User.findByIdAndUpdate(req.params.id, data, {
                        new: true
                    });
                    res.status(200).json({ msg: "اطلاعات شما با موفقیت به روز رسانی شد" });
                }
                else {
                    res.status(422).json({ msg: "تکرار رمز عبور اشتباه هست." });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.updateMiniUser = updateMiniUser;




const EmailSendChanger = async (req, res) => {
    try {
        const newUser = {
            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            emailSend: req.body.emailSend
        }
        await User.findByIdAndUpdate(req.user._id, newUser, {
            new: true
        });
        res.status(200).json({ msg: "وضعیت ارسال ایمیل تغییر کرد..." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.EmailSendChanger = EmailSendChanger;




const confirmEmail = async (req, res) => {
    try {
        const theUser = await User.findById(req.user._id);
        if (theUser.activateCode == req.body.activateCode) {
            const newUser = {
                updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                userIsAcive: true
            }
            await User.findByIdAndUpdate(req.user._id, newUser, {
                new: true
            });
            res.status(200).json({ msg: "حساب کاربری با موفقیت فعال شد..." });
        }
        else {
            res.status(401).json({ msg: "کد تایید اشتباه است..." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.confirmEmail = confirmEmail;






const favoriteProductMan = async (req, res) => {
    try {
        const theUser = await User.findById(req.user._id);
        if (theUser.userIsAcive == true) {
            if (req.body.method == "push") {
                const newUserFavProducts = [...theUser.favoriteProducts, req.body.newFavProduct];
                let userHaveProduct = 0;
                for (let i = 0; i < theUser.favoriteProducts.length; i++) {
                    if (req.body.newFavProduct == theUser.favoriteProducts[i]) {
                        userHaveProduct = 1;
                        break;
                    }
                }
                if (userHaveProduct == 0) {
                    const newUser = {
                        favoriteProducts: newUserFavProducts
                    }
                    await User.findByIdAndUpdate(req.user._id, newUser, {
                        new: true
                    });
                    res.status(200).json({ msg: "به محصولات مورد علاقه افزوده شد..." });
                } else {
                    res.status(401).json({ msg: "قبلا به محصولات مورد علاقه اضافه شده است." });
                }
            }
            else if (req.body.method == "remove") {
                const oldFavProducts = theUser.favoriteProducts;
                for (let i = 0; i < oldFavProducts.length; i++) {
                    if (oldFavProducts[i] == req.body.goalFavProductId) {
                        let updatedUserFav = oldFavProducts;
                        if (i > -1) {
                            updatedUserFav.splice(i, 1);
                        }
                        const updatedFavPro = { favoriteProducts: updatedUserFav }
                        await User.findByIdAndUpdate(req.user._id, updatedFavPro, {
                            new: true
                        });
                    }
                }
                res.status(200).json({ msg: "از محصولات مورد علاقه حذف شد..." });
            }
            else {
                res.status(401).json({ msg: "خطا در ارسال اطلاعات محصولات مورد علاقه..." });
            }
        } else {
            res.status(401).json({ msg: "لطفا ایمیل خود را تایید کنید." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.favoriteProductMan = favoriteProductMan;




const cartMan = async (req, res) => {
    try {
        const theUser = await User.findById(req.user._id);
        if (theUser.userIsAcive == true) {
            if (req.body.method == "push") {
                const newUserCartProducts = [...theUser.cart, req.body.newCartProduct];
                let userHaveProduct = 0;
                for (let i = 0; i < theUser.cart.length; i++) {
                    if (req.body.newCartProduct == theUser.cart[i]) {
                        userHaveProduct = 1;
                        break;
                    }
                }
                if (userHaveProduct == 0) {
                    const newUser = {
                        cart: newUserCartProducts
                    }
                    await User.findByIdAndUpdate(req.user._id, newUser, {
                        new: true
                    });
                    res.status(200).json({ msg: "به سبد خرید افزوده شد..." });
                } else {
                    res.status(401).json({ msg: "قبلا به سبد خرید اضافه شده است." });
                }
            }
            else if (req.body.method == "remove") {
                const oldCartProducts = theUser.cart;
                for (let i = 0; i < oldCartProducts.length; i++) {
                    if (oldCartProducts[i] == req.body.goalCartProductId) {
                        let updatedUserCart = oldCartProducts;
                        if (i > -1) {
                            updatedUserCart.splice(i, 1);
                        }
                        const updatedCartPro = { cart: updatedUserCart }
                        await User.findByIdAndUpdate(req.user._id, updatedCartPro, {
                            new: true
                        });
                    }
                }
                res.status(200).json({ msg: "از سبد خرید حذف شد..." });
            }
            else {
                res.status(401).json({ msg: "خطا در ارسال اطلاعات محصولات سبد خرید..." });
            }
        } else {
            res.status(401).json({ msg: "لطفا ایمیل خود را تایید کنید." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.cartMan = cartMan;





const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(200).json({ msg: "کاربر با موفقیت حذف شد." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.deleteUser = deleteUser;




const getOneUserById = async (req, res) => {
    try {
        const goalUser = await User.findById(req.params.id).select({ password: false });

        // FOR ADDING FAV PRODUCTS TO GOALUSER
        const goalUserFavProducts = await Product.find({ _id: { $in: goalUser.favoriteProducts } })
            .select({ title: 1, slug: 1 });
        goalUser.favoriteProducts = goalUserFavProducts;


        // FOR ADDING CART PRODUCTS TO GOALUSER
        const goalUserCartProducts = await Product.find({ _id: { $in: goalUser.cart } })
            .select({ title: 1, slug: 1 });
        goalUser.cart = goalUserCartProducts;


        // FOR ADDING BUY PRODUCTS TO GOALUSER
        const goalUseruserProducts = await Product.find({ _id: { $in: goalUser.userProducts } })
            .select({ title: 1, slug: 1 });
        goalUser.userProducts = goalUseruserProducts;


        // FOR ADDING PAYMENTS TO GOALUSER
        const goalUserPayments = await Payment.find({ email: goalUser.email })
            .select({ amount: 1, payed: 1, createdAt: 1 });
        goalUser.payments = goalUserPayments;




        // FOR ADDING COMMENTS TO GOALUSER
        const goalUserComments = await Comment.find({ email: goalUser.email })
            .select({ message: 1, typeOfModel: 1, createdAt: 1 });
        goalUser.comments = goalUserComments;



        res.status(200).json(goalUser);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getOneUserById = getOneUserById;




// FOR LOGIN REGISTER AND ACCOUNT REDIRECT
const getUserDataAccount = async (req, res) => {
    try {
        const goalUser = await User.findById(req.user._id).select({ _id: 1 });
        res.status(200).json(goalUser);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getUserDataAccount = getUserDataAccount;




// FOR ADMIN REDIRECT
const getUserAdminData = async (req, res) => {
    try {
        const goalUser = await User.findById(req.user._id).select({ _id: 1 });
        res.status(200).json(goalUser);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getUserAdminData = getUserAdminData;




// ACCOUNT AND CART PAGE
const getPartOfUserData = async (req, res) => {
    try {
        const theSlug = req.params.slug;
        if (theSlug == "info") {
            const goalUser = await User.findById(req.user._id).select({ username: 1, displayname: 1, email: 1, createdAt: 1, updatedAt: 1, emailSend: 1, userIsAcive: 1, activateCodeSendingNumber: 1 });
            res.status(200).json(goalUser);
        } else if (theSlug == "favorite") {
            const goalUser = await User.findById(req.user._id).select({ favoriteProducts: 1 });
            const goalProducts = await Product.find({ _id: { $in: goalUser.favoriteProducts } })
                .select({ title: 1, slug: 1, image: 1, price: 1, shortDesc: 1, typeOfProduct: 1, features: 1, buyNumber: 1, });
            res.status(200).json(goalProducts);
        }
        // FOR CART
        else if (theSlug == "cart") {
            const goalUser = await User.findById(req.user._id).select({ cart: 1 });
            const goalProducts = await Product.find({ _id: { $in: goalUser.cart } })
                .select({ title: 1, slug: 1, image: 1, price: 1, shortDesc: 1, typeOfProduct: 1, features: 1, buyNumber: 1, });
            res.status(200).json(goalProducts);
        }
        else if (theSlug == "files") {
            const goalUser = await User.findById(req.user._id).select({ userProducts: 1 });

            // ADDING USER FILES FULL DATA TO OBJECT
            const goalProducts = [];
            for (let i = goalUser.userProducts.length; i >= 0; i--) {
                const goalProduct = await Product.findById(goalUser.userProducts[i]).select({ title: 1, slug: 1, image: 1, mainFile: 1, imageAlt: 1, });
                if (goalProduct) {
                    goalProducts.push(goalProduct);
                }
            }
            res.status(200).json(goalProducts);
        } else if (theSlug == "comments") {

            const goalUser = await User.findById(req.user._id);
            const userComments = await Comment.find({ email: goalUser.email }).sort({ _id: -1 }).select({ createdAt: 1, published: 1, typeOfModel: 1, src_id: 1, message: 1, });

            const fullDataUserComments = [];

            // ADDING SOURSE POST OR PRODUCT TO THE COMMENT
            for (let i = 0; i < userComments.length; i++) {
                let theSrc = {};
                if (userComments[i].typeOfModel == "post") {
                    const postSrc = await Post.findById(userComments[i].src_id).select({ title: 1, slug: 1 });
                    theSrc = postSrc;
                } else {
                    const productSrc = await Product.findById(userComments[i].src_id).select({ title: 1, slug: 1 });
                    theSrc = productSrc;
                }
                const newCommentData = {
                    createdAt: userComments[i].createdAt,
                    published: userComments[i].published,
                    typeOfModel: userComments[i].typeOfModel,
                    src_id: userComments[i].src_id,
                    message: userComments[i].message,
                    src: theSrc,
                }
                fullDataUserComments.push(newCommentData);
            }

            res.status(200).json(fullDataUserComments);



        } else if (theSlug == "payments") {

            // LOADING USER PAYMENTS
            const goalUser = await User.findById(req.user._id).select({ payments: 1 });

            // LOADING PAYMETNS WITH IDS THIS IS IN THE USER PAYMENTS
            const goalPayments = await Payment.find({ _id: { $in: goalUser.payments } })
                .select({ amount: 1, payed: 1, createdAt: 1, products: 1, resnumber: 1 }).sort({ _id: -1 });

            for (let i = 0; i < goalPayments.length; i++) {
                // FIND PRODUCTS OF PAYMENTS
                const goalProducts = await Product.find({ _id: { $in: goalPayments[i].products } })
                    .select({ title: 1, slug: 1, image: 1, imageAlt: 1, price: 1, typeOfProduct: 1, pageView: 1, buyNumber: 1, categories: 1, features: 1, shortDesc: 1, tags: 1 });

                // SETTING PRODUCTS OF PAYMENTS
                goalPayments[i].products = goalProducts;
            }

            res.status(200).json(goalPayments);
        } else {
            res.status(200).json({ msg: "عدم تعیین بخش مورد نیاز..." });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getPartOfUserData = getPartOfUserData;




// HEADER CART NUMBER
const cartNumber = async (req, res) => {
    try {
        let token = req.cookies.auth_cookie;
        if (!token) {
            token = req.headers.auth_cookie;
        }
        if (!token) {
            res.status(200).json({ number: 0 });
        } else {
            try {
                const verified = jwt.verify(token, process.env.TOKEN_SECRET);
                const goalUser = await User.findById(verified._id).select({ cart: 1 });
                res.status(200).json({ number: goalUser.cart.length });
            } catch (err) {
                console.log(err);
                res.status(200).json({ number: 0 });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.cartNumber = cartNumber;




const searchUsers = async (req, res) => {
    try {
        const theUser = await User.find({ email: req.body.email }).select({ _id: true });
        if (theUser.length > 0) {
            res.status(200).json({ userData: theUser[0] });
        } else {
            res.status(200).json({ userData: 0 });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.searchUsers = searchUsers;






const uncheckPayment = async (req, res) => {
    try {
        const newPaymentData = {
            viewed: false
        }
        await Payment.findByIdAndUpdate(req.params.id, newPaymentData, {
            new: true
        });
        res.status(200).json({ msg: "سفارش به بخش سفارش های جدید افزوده شد." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.uncheckPayment = uncheckPayment;




const uncheckComment = async (req, res) => {
    try {
        const newCommentData = {
            viewed: false
        }
        await Comment.findByIdAndUpdate(req.params.id, newCommentData, {
            new: true
        });
        res.status(200).json({ msg: "دیدگاه به بخش دیدگاه های جدید افزوده شد." });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.uncheckComment = uncheckComment;







const getNewItems = async (req, res) => {
    try {
        const newUsers = await User.find({ viewed: false });
        const newPayments = await Payment.find({ viewed: false });
        const newComments = await Comment.find({ viewed: false });
        const sendingData = {
            newUsersNum: newUsers.length,
            newPaymentsNum: newPayments.length,
            newCommentsNum: newComments.length,
        }
        res.status(200).json(sendingData);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
module.exports.getNewItems = getNewItems;

