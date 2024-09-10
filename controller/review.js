const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createreview=async(req,res)=>
    {
         let listing=await Listing.findById(req.params.id)
         let newReview=new Review(req.body.review);
         newReview.author=req.user._id;
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        req.flash("success","Review is added successfully");
        res.redirect(`/listings/${listing.id}`);
     }
     module.exports.deletereview=async(req,res)=>
        {
             let{id,reviewId}=req.params;
             await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
             await Review.findByIdAndDelete(reviewId);
             req.flash("success","Review deleted successfully");
             res.redirect(`/listings/${id}`);
             
        }