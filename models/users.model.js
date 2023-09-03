const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - userID
 *          - name
 *          - password
 *          - isDev
 *          - isAdmin
 *        properties:
 *          userID:
 *            type: string
 *            description: 사용자 ID. 6~20자의 영문 소문자로 이루어져야 함
 *          name:
 *            type: string
 *            description: 사용자의 이름. 문자열 형 고정 외 제한사항 없음
 *          password:
 *            type: string
 *            description: 비밀번호. 6자 이상으로 이루어져야 함
 *          isDev:
 *            type: boolean
 *            description: 해당 사용자가 개발자인지 여부를 나타냄. 유저 필터링에 사용. 기본값 false
 *          isAdmin:
 *            type: boolean
 *            description: 해당 사용자가 관리자인지 여부를 나타냄. 유저 필터링에 사용. 기본값 false
 *
 */

const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDev: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const user = mongoose.model("user", userSchema);
module.exports = user;
