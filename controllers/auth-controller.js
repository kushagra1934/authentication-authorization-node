//register controller
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user controller
const registerUser = async (req, res) => {
  try {
    //extract user info from req.body
    const { username, email, password, role } = req.body;

    //check if the user already exist in db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exist either with same username or same email. Please try with different username or email",
      });
    }

    //hash the user pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    //send response
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "user created successfully",
        data: newlyCreatedUser,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (e) {
    console.log(e);
    res.send(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//login controller

const loginUser = async (req, res) => {
  try {
    //extract user info from req.body
    const { username, password } = req.body;
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.send(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//change password controller
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new pass
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //check if the old password is correct ?
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "old pass not correct please try again",
      });
    }

    //hash the new passwrod
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.send(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};
