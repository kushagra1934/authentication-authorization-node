const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with the uploaded user id in DB

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //delete the file from local storage
    // fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images) {
      res.status(200).json({
        success: true,
        message: "Images fetched successfully",

        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  uploadImage,
  fetchImageController,
};
