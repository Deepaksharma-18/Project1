const express=require("express");
const router=express.Router({mergeParams:true});
const {isreviewAuthor}=require("../middleware.js");
const isValidate=require("../middleware.js");
const wrapasync=require("../utils/wrapasync.js");
const {reviewValidate} = require("../middleware.js");
const reviewcontroller=require("../controller/review.js");
router.post("/",reviewValidate,wrapasync(reviewcontroller.createreview));
router.delete("/:reviewId",isreviewAuthor,wrapasync(reviewcontroller.deletereview));
module.exports=router;