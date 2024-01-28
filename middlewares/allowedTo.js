const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
module.exports = (...roles) => {
  // console.log("roles: ", roles);
  return (req, res, next) => {
    if (roles.includes(req.currentUser.role)) next();
    else {
      const error = appError.create(
        "This role is not authorized",
        401,
        httpStatusText.ERROR
      );
      next(error);
    }
  };
};
