const createError = require("http-errors");
const user = require("../../models/users.model.js");
const pseudoSession = require("../../models/pseudoSession.model.js");
const {
  authSchema,
  authUserIDSchema,
  authUserNameSchema,
  authUserPasswordSchema,
} = require("../../resources/validation_schema.js");
const { token } = require("../../resources/jwt_management.js");

const process = {
  /**
   * 회원가입 요청의 실행을 담당합니다
   */
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

      res.send({
        success: true,
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  /**
   * ID 중복확인 요청의 실행을 담당합니다
   */
  idValidity: async (req, res, next) => {
    try {
      const result = await authUserIDSchema.validateAsync(req.body.userID);
      const doesExistID = await user.findOne({ userID: result });
      if (doesExistID) {
        res.send({
          success: false,
          message: "다른 사용자가 해당 ID를 사용중입니다",
        });
      } else {
        res.send({ success: true, message: "사용 가능한 ID입니다" });
      }
    } catch (error) {
      if (error.isJoi === true) {
        res.send({ success: false, message: "잘못된 서식의 ID입니다" });
      } else {
        next(error);
      }
    }
  },

  /**
   * 로그인 요청의 실행을 담당합니다
   */
  login: async function (req, res, next) {
    try {
      const result = await authSchema.validateAsync(req.body);
      const foundUser = await user.findOne({ userID: result.userID });

      if (!foundUser) {
        throw createError.NotFound("해당하는 ID의 유저가 없습니다");
      }

      const isMatch = await foundUser.isValidPassword(result.password);
      if (!isMatch) {
        throw createError.Unauthorized("비밀번호가 잘못되었습니다");
      }

      const accessToken = await token.genAccessToken(foundUser.userID);
      const refreshToken = await token.genRefreshToken(foundUser.userID);

      const newPseudoSession = new pseudoSession({
        userID: foundUser.userID,
        refreshToken,
        accessToken,
      });

      const savedPseudoSession = await newPseudoSession.save();

      res.send({
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(
          createError.BadRequest("ID 또는 비밀번호의 서식이 잘못되었습니다")
        );
      next(error);
    }
  },

  /**
   * refresh-token 발행 요청의 실행을 담당합니다
   */
  refreshtoken: async function (req, res, next) {
    try {
      const { accessToken, refreshToken } = req.body;

      if (
        !refreshToken
        //|| !accessToken
      ) {
        throw createError.BadRequest();
      }

      const userID = await token.verifyRefreshToken(refreshToken);

      const resAccessToken = await token.genAccessToken(userID);
      const resRefreshToken = await token.genRefreshToken(userID);

      res.send({ accessToken: resAccessToken, refreshToken: resRefreshToken });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 로그아웃 요청의 실행을 담당합니다
   */
  logout: async function (req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();

      const userID = await token.verifyRefreshToken(refreshToken);
      await pseudoSession.deleteMany({ userID: userID });

      res.send({
        success: true,
        message: "로그아웃에 성공하였습니다",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 회원정보 수정 요청의 실행을 담당합니다
   */
  update: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const doesExistID = await user.updateOne(
        { userID: req.payload.aud },
        {
          name: req.body.name,
          password: req.body.password,
        }
      );
      console.log(doesExistID);
      if (!doesExistID) {
        throw createError.InternalServerError(
          "해당하는 ID의 유저를 찾지 못하였습니다"
        );
      }

      res.send({
        success: true,
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
};

module.exports = {
  process,
};
