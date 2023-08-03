const jwt = require("jsonwebtoken");
const Token_Key = "45656575757577567776765757575757";
const use = require("../models/userschema");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) {
    res.status(201).json({ message: "Token is empty", status: false });
  }
  jwt.verify(token, Token_Key, async (err, user) => {
    if (err) {
      return res
        .status(201)
        .json({ message: "error something went wrong", status: false });
    }
    req.user = user;
   next()
  });
};

module.exports = verifyToken;
