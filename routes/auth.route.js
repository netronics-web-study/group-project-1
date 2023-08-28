var express = require("express");
var router = express.Router();

const ctrl = require("./control/auth.control");
const accessCtrl = require("./control/access.control");
const { token } = require("../resources/jwt_management.js");
const user = require("../models/users.model.js");

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
        foundUser,
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
