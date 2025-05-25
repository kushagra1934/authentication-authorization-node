const express = require("express");
const router = express.Router();

const {
  uploadImage,
  fetchImageController,
} = require("../controllers/image-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const uploadMiddleware = require("../middlewares/upload-middleware");

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

//get alll the images
router.get("/get", authMiddleware, fetchImageController);

module.exports = router;
