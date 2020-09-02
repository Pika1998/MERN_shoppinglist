const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// User Model
const User = require("../../models/User");

/*  {
    "description":"Creates a new user",
    "inputs":{
        "name":"The name of the user.",
        "email":"Email id of the user",
        "password":"The plain text password"
    },
    "outputs":{
      "user":"A user object",
      "token":"The JWT Token"
    }
}
    */
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  // If All Fields Are Present Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user)
      return res
        .status(400)
        .json({ msg: "A user already exists with the same e-mail id" });

    const newUser = new User({
      name,
      email,
      password,
    });

    // Create salt & hash
    bcryptjs.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcryptjs.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
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
  });
});

module.exports = router;
