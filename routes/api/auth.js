const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
// User Model
const User = require("../../models/User");

/*  
{
    "description":" Logs in the user and returns a JSON Web Token",
    "label":"Public",
    "inputs":{
        "email":"The users e-mail ID",
        "password":"The users plain text password"
    },
    "outputs":{
        "user":"A user object which contains his id, name, e-mail",
        "token":"The JWT Token"
    }
}
*/
router.post("/", (req, res) => {
  const { email, password } = req.body;
  // If All Fields Are Present Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "No Such user exists" });

    // Validate Password
    bcryptjs.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      jwt.sign(
        {
          id: user.id,
        },
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;

          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            token,
          });
        }
      );
    });
  });
});

/*  
{
    "description":"Checks for token and gets the logged in user",
    "label":"Public",
    "outputs":{
        "user":"The user object stored in database",
    }
}
*/
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      res.json(user);
    });
});

module.exports = router;
