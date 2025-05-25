const express = require("express");
const router = express.Router();

const {
  uploadImage,
  fetchImageController,
  deleteImageController,
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

//delete image
//6832c836a921af6a2e4510a4
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
