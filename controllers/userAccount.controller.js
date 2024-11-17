import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.model.schema.js";
import config from "../configuration.js";

export const createSendToken = (user, res) => {
  const payload = {
    user: {
      id: user._id,
      userIsAdmin: user.userIsAdmin,
    },
  };

  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log("Token and refreshToken cookies set:", token, refreshToken);
  res.json({
    msg: "Authentication successful!",
    userId: user.id,
    token,
    refreshToken,
  });
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, userSurname, useremail, userpassword, userphonenum } = req.body;

  try {
    let user = await User.findOne({ useremail });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      userName,
      userSurname,
      useremail,
      userpassword,
      userphonenum,
      userpicture: req.file ? `/uploads/${req.file.filename}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

    });

    const salt = await bcrypt.genSalt(10);
    user.userpassword = await bcrypt.hash(userpassword, salt);

    await user.save();
    createSendToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const createAdmin = async (req, res) => {
  const { userName, userSurname, useremail, userpassword, userphonenum } =
    req.body;

  try {
    console.log("req.user:", req.user);

    let user = await User.findOne({ useremail });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Authorization check for admin creation
    if (!req.user || req.user.userIsAdmin !== true) {
      console.log("Authorization failed: User is not an admin");
      return res.status(403).json({ msg: "Not authorized to create an admin" });
    }

    user = new User({
      userName,
      userSurname,
      useremail,
      userpassword,
      userphonenum,
      userIsAdmin: true,
    });

    if (userpassword) {
      const salt = await bcrypt.genSalt(10);
      user.userpassword = await bcrypt.hash(userpassword, salt);
    } else {
      return res.status(400).json({ msg: "Password is required" });
    }

    await user.save();

    createSendToken(user, res);
  } catch (err) {
    console.error("Error in createAdmin:", err.message);
    res.status(500).send("Server error");
  }
};


export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { useremail, userpassword } = req.body;

  try {
    let user = await User.findOne({ useremail });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(userpassword, user.userpassword);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    createSendToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serve error");
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ msg: "User logged out" });
};
