//register controller

const registerUser = async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.send(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
