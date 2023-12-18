const express= require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const cloud= require('./utils/cloudinary.js');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended:true }));
app.use(cors());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage });
  app.post('/upload', upload.single('file'),(req, res)=>{
    cloud.uploader.upload(req.file.path, (err, result)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                output: false
            })
        }
        fs.unlinkSync(req.file.path);
        res.status(200).json({
            output:true,
            result
        })
    })
  });

app.listen(3000, ()=>{
    console.log("Server listening on port 3000");
})