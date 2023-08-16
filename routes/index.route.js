var express = require("express");
var router = express.Router();

const { token } = require("../resources/jwt_management");

/*Imports modules from controller files */
const ctrl = require("./control/index.control");

/* GET home page. */
router.get("/", ctrl.rend.index);

/**
 * If GET request arrived => Route to signup page
 */
router.get("/signup", ctrl.rend.signup);

/**
 * If GET request arrived => Route to signup page
 */
router.get("/signin", ctrl.rend.signin);

module.exports = router;
