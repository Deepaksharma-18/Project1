const mongoose=require("mongoose");
const Listing = require("../models/listing.js");
const initData=require("./data.js");
main()
.then(()=>console.log("Connection sucess!")
)
.catch((err)=>
{
    console.log(err);
    
})
async  function main()
{
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb=async()=>
{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
      ...obj,owner:"66d66536822f8b2be7e35ec8"
    }))
    await Listing.insertMany(initData.data);
}
initDb();