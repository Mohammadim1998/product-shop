const express = require('express');
const router = express();
const { check } = require('express-validator');

const CommentCtrl = require('../controllers/CommentCtrl');

const userExist= require('../middlewares/userExist');
const isAdmin= require('../middlewares/isAdmin');

router.post("/new-comment",userExist, [
    check("message", "تعداد کارکتر دیدگاه شما باید بیشتر از 20 کارکتر باشد...").isLength({ min: 20 }),
], CommentCtrl.newComment);

router.get("/comments",isAdmin, CommentCtrl.getAllComments);
router.get("/not-viewed-comments",isAdmin, CommentCtrl.getAllNotViewedComments);

router.post("/update-comment/:id", [
    check("message", "تعداد کارکتر دیدگاه شما باید بیشتر از 20 کارکتر باشد...").isLength({ min: 20 }),
],isAdmin, CommentCtrl.updateComment);
router.post("/delete-comment/:id",isAdmin, CommentCtrl.deleteComment);
// for admin
router.get("/get-comment/:id",isAdmin, CommentCtrl.getOneCommentById);
router.post("/get-model-comments", CommentCtrl.getModelComments);
router.get("/get-comment-children/:id", CommentCtrl.getCommentChildren);
router.post("/publish-comment",isAdmin, CommentCtrl.publishComment);
router.get("/get-model-comments-number/:id", CommentCtrl.getModelCommentsNumber);



module.exports = router;