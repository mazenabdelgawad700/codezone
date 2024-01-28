const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const httpStatusText = require("../utils/httpStatusText");
const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image") {
    return cb(null, true);
  } else {
    const error = appError.create(
      "only images allowed",
      400,
      httpStatusText.ERROR
    );
    return cb(error, false); // 3 05 01 20 21 00 612
  }
};

// Error, it will add the image even you register with the same user name, the image will be added whatever happens 🙂
// LOL: MAZEN EG
const upload = multer({ storage: diskStorage, fileFilter });

// Get all users
router.route("/").get(verifyToken, usersController.getAllUsers);

// Register
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

// Login
router.route("/login").post(usersController.login);

module.exports = router;
