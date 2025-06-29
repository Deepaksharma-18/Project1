if(process.env.NODE_ENV!="production")
  {

    require('dotenv').config();
  }
  
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

const app = express();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRTET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat: ['png','jpg','jpeg'],
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports={cloudinary,storage};