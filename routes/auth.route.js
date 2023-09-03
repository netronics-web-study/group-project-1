var express = require("express");
var router = express.Router();

const ctrl = require("./control/auth.control");
const accessCtrl = require("./control/access.control");
const { token } = require("../resources/jwt_management.js");
const user = require("../models/users.model.js");

/**
 * @swagger
 * components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *
 * /auth/getUserInfo:
 *    get:
 *      tags:
 *        - Authentication
 *      summary: Access Token을 사용하여 해당하는 유저의 정보를 불러옵니다.
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: 전송된 Access Token의 유효성이 검증되었으며, 해당하는 사용자의 정보가 전송되었습니다.
 *          content:
 *
 *
 *
 *
 */
router.get(
  "/getUserInfo",
  token.verifyAccessToken,
  async function (req, res, next) {
    if (req.payload) {
      const payload = req.payload;
      const foundUser = await user.findOne({ userID: payload.aud });

      foundUser.password = null;

      res.send({
        success: true,
        foundUser: {
          userID: foundUser.userID,
          name: foundUser.name,
          isDev: foundUser.isDev,
          isAdmin: foundUser.isAdmin,
        },
      });
    } else {
      return next();
    }
  },
  ctrl.process.getUserInfo
);

/**
 * 회원가입 요청을 처리합니다
 */
router.post("/register", ctrl.process.register);

/**
 * 아이디 중복확인 요청을 처리합니다
 */
router.post("/idValidity", ctrl.process.idValidity);

/**
 * 로그인 요청을 처리합니다
 */
router.post("/login", ctrl.process.login);

/**
 * refresh-token 요청을 처리합니다
 */
router.post("/refresh-token", ctrl.process.refreshtoken);

/**
 * 로그아웃 요청을 처리합니다
 */
router.delete("/logout", ctrl.process.logout);

/**
 * 회원정보 수정 요청을 처리합니다
 */
router.post("/update", token.verifyAccessToken, ctrl.process.update);

module.exports = router;
