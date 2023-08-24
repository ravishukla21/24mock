const express = require("express");

const { UserModel } = require("../models/user.model");

const bcrypt = require("bcrypt");
//to genrate a token you need jwt

const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();
userRouter.post("/register", async (req, res) => {
  //logic
  const { name, email, pass } = req.body;

  //hash the password (bcrypt)
  //post it to database
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.json({ error: err.message });
      } else {
        const user = new UserModel({ name, email, pass: hash });
        await user.save();
      }
    });
    res.json({ msg: "user has been registered", user: req.body });
  } catch (err) {
    res.json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  //logic
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          //json web token for token genration
          //check for expiry of token//random payload course: "BE"
          let token = jwt.sign(
            { userID: user._id, username: user.name },
            process.env.secret
          );
          res.json({ msg: "logged in ", token });
        } else {
          res.json({ msg: "pssword wrong" });
        }
      });
    } else {
      res.json({ msg: "user does not exist!" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = { userRouter };
