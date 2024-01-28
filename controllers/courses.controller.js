const httpStatusText = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
const Course = require("../models/course.model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourse = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);

  // SUCCESS
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();

  // SUCCESS
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    {
      $set: { ...req.body },
    }
  );

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });

  const courses = await Course.find();
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { courses } });
});

module.exports = {
  getAllCourse,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
