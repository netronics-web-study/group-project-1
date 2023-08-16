const createError = require("http-errors");
const user = require("../../models/users.model.js");
const { authSchema } = require("../../resources/validation_schema.js");
const { token } = require("../../resources/jwt_management.js");

const process = {
  //회원가입 요청의 Routing을 담당합니다
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const doesExistID = await user.findOne({ userID: result.userID });
      if (doesExistID) {
        throw createError.Conflict(
          `${result.userID}은/는 이미 사용중인 아이디입니다`
        );
      }
      const registeredUser = new user(result);
      const savedUser = await registeredUser.save();
      const accessToken = await token.genAccessToken(savedUser.userID);

      res.send({ accessToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }, //ID 중복확인 요청의 Routing을 담당합니다
  idValidity: async (req, res, next) => {
    try {
      console.log(req.body.userID);
      const result = await authSchema.validateAsync(req.body);

      const doesExistID = await user.findOne({ userID: result.body.userID });
      if (doesExistID) {
        res.send({ success: false });
        console.log("중복된 아이디 확인");
      } else {
        res.send({ success: true });
      }
    } catch (error) {
      if (error.isJoi === true) {
        res.send({ success: false });
      } else {
        next(error);
      }
    }
  },
  //로그인 요청의 Routing을 담당합니다
  login: async function (req, res, next) {
    try {
      const result = await authSchema.validateAsync(req.body.userID);
      const foundUser = await user.findOne({ userID: result.userID });

      if (!foundUser) {
        throw createError.NotFound("해당하는 ID의 유저가 없습니다");
      }

      const isMatch = await foundUser.isValidPassword(result.password);
      if (!isMatch) {
        throw createError.Unauthorized("비밀번호가 잘못되었습니다");
      }

      const accessToken = await token.genAccessToken(foundUser.userID);

      res.send({ accessToken });
    } catch (error) {
      if (error.isJoi === true)
        return next(
          createError.BadRequest("ID 또는 비밀번호가 잘못되었습니다")
        );
      next(error);
    }
  },
  //refresh-token 발행 요청의 Routing을 담당합니다
  refreshtoken: function (req, res, next) {
    res.send("토큰 발행 요청 감지");
  },
  //로그아웃 요청의 Routing을 담당합니다
  logout: function (req, res, next) {
    res.send("로그아웃 요청 감지");
  },
};

module.exports = {
  process,
};
