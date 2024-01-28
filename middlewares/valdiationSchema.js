const { body } = require("express-validator");

const courseValidation = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 2 })
      .withMessage("Title has at least 2 digits"),
    body("price").notEmpty().withMessage("Price is required"),
  ];
};

module.exports = {
  courseValidation,
};
