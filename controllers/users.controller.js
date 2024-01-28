const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  // SUCCESS
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  console.log(req.file.filename);

  // Hasing the password
  const hasedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hasedPassword,
    role: role,
    avatar: req.file.filename,
  });

  await newUser.save();

  // Generate JWT token
  const token = await generateToken({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = appError.create(
      "email & password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("user not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    // Loggen in successfully

    const token = await generateToken({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create("wrong password!", 403, httpStatusText.FAIL);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  login,
  register,
};
