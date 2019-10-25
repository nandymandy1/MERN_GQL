const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { appkey } = require("../../config/db");

module.exports = {
  /**
   * @USER_REGISTER f(x)
   */
  registerUser: async ({ userInput }) => {
    try {
      const regUser = await User.findOne({ email: userInput.email });
      if (regUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        email: userInput.email,
        password: hashedPassword
      });
      let result = await user.save();
      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  /**
   * @USER_LOGIN f(x)
   */
  loginUser: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User does not exists.");
      }
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password.");
      }
      let token = jwt.sign({ userId: user.id, email: user.email }, appkey, {
        expiresIn: "2h"
      });
      return {
        userId: user.id,
        token,
        tokenExpiration: 2
      };
    } catch (err) {
      throw err;
    }
  }
};
