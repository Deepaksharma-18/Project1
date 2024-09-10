const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const isValidate=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {listingValidate} = require("../middleware.js");
const listingcontroller=require("../controller/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage: storage });
router.get("/", wrapasync(listingcontroller.index));
router.get("/new",isValidate,listingcontroller.createnewlisting);
router.post("/", upload.single("listing[image]"),listingValidate, wrapasync(listingcontroller.postnewlisting));
router.get("/:id",wrapasync(listingcontroller.getlisting));
router.put("/:id", isValidate,isOwner,upload.single("listing[image]"),listingValidate,wrapasync(listingcontroller.editlisting));
router.get("/:id/edit",wrapasync(listingcontroller.geteditlisting));
router.delete("/:id",isValidate,isOwner,wrapasync(listingcontroller.deletelisting));
// router
// .route("/")
// .get(wrapasync(listingcontroller.index))
// .post(listingValidate,upload.single("listing[image]"),wrapasync(listingcontroller.createnewlisting))
// router
// .route("/:id")
// .get(wrapasync(listingcontroller.getlisting))
// .put(isValidate,isOwner,listingValidate,wrapasync(listingcontroller.editlisting))
// .delete(isValidate,isOwner,wrapasync(listingcontroller.deletelisting))
// router.get("/:id/edit",isOwner,isValidate,wrapasync(listingcontroller.geteditlisting));
module.exports=router;


