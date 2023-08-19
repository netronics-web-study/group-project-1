var express = require("express");
var router = express.Router();

const { token } = require("../resources/jwt_management");

/*Imports modules from controller files */
const ctrl = require("./control/index.control");

/* GET home page. */
router.get("/", ctrl.rend.index);

/**
 * 회원가입 페이지로 이동
 */
router.get("/register", ctrl.rend.signup);

/**
 * 로그인 페이지로 이동
 */
router.get("/login", ctrl.rend.signin);

module.exports = router;
