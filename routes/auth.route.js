/**
 * 회원가입 홈페이지에서의 Routing을 담당합니다
 */

var express = require("express");
var router = express.Router();

const ctrl = require("./control/auth.control");
const { token } = require("../resources/jwt_management.js");

router.get("/", token.verifyAccessToken, async function (req, res, next) {
  res.send({
    success: true,
  });
});

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
