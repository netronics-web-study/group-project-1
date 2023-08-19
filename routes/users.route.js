var express = require("express");
var router = express.Router();

const { token } = require("../resources/jwt_management");

const ctrl = require("./control/users.control");

/**
 * /user/... 주소에 대한 모든 접근은 사용자의 access token 검증을 필요로 합니다
 */
router.use("/", token.verifyAccessToken);

/**
 * 유저 정보 수정 페이지와 함께 유저 정보를 전송합니다
 */
router.get("/mypage", ctrl.rend.mypage);

module.exports = router;
