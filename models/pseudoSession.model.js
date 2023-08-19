const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const pseudoSessionSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
});

pseudoSessionSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(this.refreshToken, salt);
    const hashedAccessToken = await bcrypt.hash(this.accessToken, salt);
    this.refreshToken = hashedRefreshToken;
    this.accessToken = hashedAccessToken;
  } catch (error) {
    next(error);
  }
});

pseudoSessionSchema.methods.isValidTokens = async function (
  refreshToken,
  accessToken
) {
  try {
    if (
      bcrypt.compare(refreshToken, this.refreshToken) &&
      bcrypt.compare(accessToken, this.accessToken)
    ) {
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

const pseudoSession = mongoose.model("pseudoSession", pseudoSessionSchema);
module.exports = pseudoSession;
