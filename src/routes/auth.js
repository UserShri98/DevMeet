const express = require('express');
const authRouter = express.Router();
const { validation } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// SIGNUP
// SIGNUP
authRouter.post('/signup', async (req, res) => {
  try {
    const validationResult = validation(req);
    if (validationResult !== true) {
      return res.status(400).json({ error: validationResult });
    }

    const { firstName, lastName, email, age, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      password: hashedPassword
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 360000)
    });

    return res.json({ message: "User added successfully", data: savedUser });

  } catch (err) {
    return res.status(400).json({ message: "Error", error: err.message });
  }
});

// LOGIN
authRouter.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid credentials");  // STOP here
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");  // STOP here
    }

    const token = await user.getJWT();
    res.cookie("token", token);

    return res.send(user);  // STOP here

  } catch (err) {
    return res.status(400).json({ message: "Error", error: err.message });
  }
});

// LOGOUT
authRouter.post('/logout', (req, res) => {
   res.cookie("token", null, {
     expires: new Date(Date.now())
   });
   return res.send("Logout Successfully");
});

module.exports = authRouter;
