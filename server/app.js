const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const cloud = require("./utils/cloudinary.js");
const util = require("util");
const uploadAsync = util.promisify(cloud.uploader.upload);
const unlinkAsync = util.promisify(fs.unlink);
const webp = require("webp-converter");
webp.grant_permission();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const uploadResults = [];

    for (const file of req.files) {
      try {
        const convertedFileName = file.path.replace(/\.[^.]+$/, '.webp');
        await webp.cwebp(file.path, convertedFileName, "-q 80");
        const result = await uploadAsync(convertedFileName);
        await Promise.all([unlinkAsync(file.path), unlinkAsync(convertedFileName)]);

        uploadResults.push(result);
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({
          output: false,
          error: "Error uploading file to Cloudinary",
        });
      }
    }

    console.log("All files uploaded successfully:", uploadResults);

    res.status(200).json({
      output: "ok",
      uploadResults: uploadResults,
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({
      output: false,
      error: "Internal Server Error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
