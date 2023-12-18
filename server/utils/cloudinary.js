const cloud = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
cloud.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.CLOUDSECRET 
  });
module.exports = cloud;