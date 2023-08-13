const createError = require("http-errors");
const user = require("../../models/users.model.js");
const { authSchema } = require("../../helpers/validation_schema.js");

const process = {
  //회원가입 요청의 Routing을 담당합니다
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      console.log(result);

      const doesExistID = await user.findOne({ userID: result.userID });
      if (doesExistID) {
        throw createError.Conflict(`${id}은/는 이미 사용중인 아이디입니다`);
      }
      const registeredUser = new user(result);
      const savedUser = await registeredUser.save();

      res.send(savedUser);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  //로그인 요청의 Routing을 담당합니다
  login: function (req, res, next) {
    res.send("로그인 요청 감지");
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
