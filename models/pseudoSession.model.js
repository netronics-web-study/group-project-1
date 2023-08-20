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
    const salt1 = await bcrypt.genSalt(10);
    const salt2 = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(this.refreshToken, salt1);
    const hashedAccessToken = await bcrypt.hash(this.accessToken, salt2);
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
      bcrypt.compareSync(refreshToken, this.refreshToken) &&
      bcrypt.compareSync(accessToken, this.accessToken)
    ) {
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

const pseudoSession = mongoose.model("pseudoSession", pseudoSessionSchema);
module.exports = pseudoSession;
