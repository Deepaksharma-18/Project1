const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {reviewSchema}=require("./schema.js");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports=isValidate=(req,res,next)=>
{
       if(!req.isAuthenticated())
            {
                req.session.redirectUrl=req.originalUrl;
                 req.flash("error","Login to create new listing");
                 return res.redirect('/login');
            }  
    next();
}

module.exports.savedUrl=(req,res,next)=>
{
   if(req.session.redirectUrl)
   {
     res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner=async(req,res,next)=>
{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id))
  {
     req.flash("error","You don't have permission");
     return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isreviewAuthor=async(req,res,next)=>
{
     let {id,reviewId}=req.params;
     let review=await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id))
     {
          req.flash("error","You are not author of  the review");
          return res.redirect(`/listings/${id}`);
     }
     next();
}
module.exports.listingValidate=(req,res,next)=>
     {
         let {error}=listingSchema.validate(req.body);
             console.log(error);
             if(error)
             {
     
                 let errmsg=error.details.map((el)=> el.message).join(",");
                 throw new ExpressError(400,errmsg);
             }
             else{
                 next();
             }
     
     }

module.exports.reviewValidate=(req,res,next)=>
     {
         let {error}=reviewSchema.validate(req.body);
             console.log(error);
             if(error)
             {
     
                 let errmsg=error.details.map((el)=> el.message).join(",");
                 throw new ExpressError(400,errmsg);
             }
             else{
                 next();
             }
     
     }

    