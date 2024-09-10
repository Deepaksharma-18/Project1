const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { populate } = require("../models/review.js");
module.exports.index=async(req,res)=>
    {
        let allListings= await Listing.find();
        res.render("listings/home.ejs",{allListings});
    }
module.exports.createnewlisting=(req,res)=>
    {
        // console.log(req.user);
        // console.log(req.originalUrl);
        
        res.render("listings/new.ejs")
    }
module.exports.postnewlisting= async(req,res)=>     
        {
               
         //    let{title:newtitle,description:newdescription,price:newprice,location:newlocation,country:newcountry}=req.body
         //     let newListing=  Listing({title:newtitle,
         //         description:newdescription,
         //         price:newprice,
         //         location:newlocation,
         //         country:newcountry
            //  });    
             let url=req.file.path;
             let filename=req.file.filename;
           const newListing = new Listing(req.body.listing);
             newListing.owner=req.user._id;
             newListing.image={url,filename};
             await newListing.save();
             req.flash("success","Listing added successfully");
             res.redirect("/listings")
         }


module.exports.getlisting=async (req,res)=>
    {
        let {id}=req.params;
        let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
        // console.log(listing.reviews); 
        
        if(!listing)
            {
                req.flash("error","Listing does not exist")
                res.redirect("/listings")
            }
            else{
        res.render("listings/show.ejs",{listing});}
    }

    module.exports.geteditlisting=async (req,res)=>
        {
            let {id}=req.params;
            let listing = await Listing.findById(id);
            if(!listing)
            {
        req.flash("error","Listing does not exist");
            }
            res.render("listings/edit.ejs",{listing});
        }

        module.exports.editlisting=async(req,res)=>
            {
               let {id}=req.params;
            //    let{title:newtitle,description:newdescription,price:newprice,location:newlocation,country:newcountry}=req.body
            //    let updatedListing = await Listing.findByIdAndUpdate(id,{
            //     title:newtitle,
            //     description:newdescription,
            //     price:newprice,
            //     location:newlocation,
            //     country:newcountry
            //    });
             let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
             if(typeof req.file!=="undefined")
             {
                let url=req.file.path;
                let filename=req.file.filename;
                listing.image={url,filename};
                await listing.save();
             }
            req.flash("success","Listing is Edited ");
               res.redirect(`/listings/${id}`);
            }

            module.exports.deletelisting=async (req,res)=>
                {
                    let {id}=req.params;
                    let dltListing= await Listing.findByIdAndDelete(id);
                req.flash("success","Listing deleted successfully");
                    res.redirect("/listings")
                }

                