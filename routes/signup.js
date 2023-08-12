/**
 * 로그인 홈페이지에서의 Routing을 담당합니다
 */

var express = require("express");
var router = express.Router();

/*Imports modules from controller files */
const ctrl = require("./control/control.signup");

/**
 * If POST request arrived =>
 */
router.post("/signup", ctrl.process.signup);
