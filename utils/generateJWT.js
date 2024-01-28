const jwt = require("jsonwebtoken");
module.exports = async (payLoad) => {
  const token = await jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
    expiresIn: "10h",
  });

  return token;
};
