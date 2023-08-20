const createError = require("http-errors");
const { token } = require("../../resources/jwt_management.js");

const allow = {
  /**
   * 인증된 유저만 통과시키는 Router입니다
   */
  onlyAuthUser: async function (req, res, next) {
    try {
      token.verifyAccessToken(req, res, next);
    } catch (error) {
      if (error.status == 401 && error.message == "jwp expired") {
        res.send({
          success: false,
          message:
            "AccessToken이 만료되었습니다. RefreshToken을 재발급받으십시오",
        });
      }
    }
  },
};

const findOut = {
  /**
   * 유저의 인증 여부를 확인하기만 하고, 그 결과를 사용자에게 넘기는 Router입니다
   */
  isAuthUser: async function (req, res, next) {
    if (req.payload) {
      res.send({
        success: true,
        message: "유저가 감지되었습니다",
      });
    } else {
      next(createError.InternalServerError());
    }
  },

  whatProblemIs: async function (error, req, res, next) {
    if (error.status == 401 && error.message == "jwp expired") {
      res.send({
        success: false,
        message:
          "AccessToken이 만료되었습니다. RefreshToken을 재발급받으십시오",
      });
    } else if (
      error.status == 401 &&
      (error.message == "Unauthorized" || error.message == "잘못된 요청입니다")
    ) {
      res.send({
        success: false,
        message: "로그인되지 않은 사용자입니다",
      });
    } else {
      next(error);
    }
  },
};

module.exports = {
  allow,
  findOut,
};
