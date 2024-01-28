const express = require("express");
const { courseValidation } = require("../middlewares/valdiationSchema");
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles")
const allowedTo = require("../middlewares/allowedTo"); // ======================================
const router = express.Router();
const coursesController = require("../controllers/courses.controller");

router
  .route("/")
  .get((req, res) => {
    coursesController.getAllCourse(req, res);
  })
  .post(verifyToken, allowedTo(userRoles.MANAGER) , courseValidation(), (req, res, next) => {
    coursesController.addCourse(req, res, next);
  });

router
  .route("/:courseId")
  .get((req, res, next) => {
    coursesController.getCourse(req, res, next);
  })
  .patch((req, res, next) => {
    coursesController.updateCourse(req, res, next);
  })
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), (req, res, next) => {
    coursesController.deleteCourse(req, res, next);
  });

module.exports = router;
