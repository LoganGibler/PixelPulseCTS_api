// authMiddleware.js
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const User = require("./db/userSchema");

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  const user_id = req.headers["user_id"];

  const user = await User.findOne({ _id: user_id }).select("-password");
  // console.log("user: ", user);

  if (token !== "undefined") {
    jwt.verify(token, process.env.userJWT, function (err, decodedToken) {
      if (err) {
        console.info("token did not work");
        return res.status(404).send("Error");
      }
      req.token = token;
      req.user = user;
      // console.log(req.user.active);

      if (req.user === null) {
        return res.status(300);
      } else if (req.user.active === false) {
        return res
          .status(408)
          .json({ message: "User is disabled. Please contact administator." });
      } else {
        // console.info("Next()");
        next();
      }
    });
  } else {
    res.sendStatus(406);
  }
};

module.exports = authenticate;
