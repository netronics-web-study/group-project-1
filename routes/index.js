var express = require("express");
var router = express.Router();

/*Imports modules from controller files */
const ctrl = require("./control/control.index");

/* GET home page. */
router.get("/", ctrl.rend.index);

/**
 * If GET request arrived => Route to signup page
 */
router.get("/signup", ctrl.rend.signup);

module.exports = router;
