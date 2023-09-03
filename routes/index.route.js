var express = require("express");
var router = express.Router();

const { token } = require("../resources/jwt_management");

/*Imports modules from controller files */
const ctrl = require("./control/index.control");

/**
 * @swagger
 * /:
 *   get:
 *      tags:
 *          - Index
 *      summary: 메인 페이지를 불러옵니다.
 *      responses:
 *          200:
 *              description: 메인 페이지를 불러오는 데 성공하였습니다. 필요시 동적 구성을 위해 유저 정보를 요청하십시오.
 *              content:
 *                  text/html:
 *                      schema:
 *                          type: string
 *                          example: Router로 연결된 ejs의 파일 내용...
 *          500:
 *              description: 서버 내부 오류입니다. 발생 시 request/response 정보를 백엔드에게 알려주십시오.
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      status:
 *                                          type: integer
 *                                      message:
 *                                          type: string
 *                          example:
 *                              error: {
 *                                  status: 500,
 *                                  message: "오류 발생 내용..."
 *                              }
 */
router.get("/", ctrl.rend.index);

/**
 * @swagger
 * /register:
 *   get:
 *      tags:
 *          - Index
 *      summary: 회원가입 페이지를 불러옵니다.
 *      responses:
 *          200:
 *              description: 회원가입 페이지를 불러오는 데 성공하였습니다.
 *              content:
 *                  text/html:
 *                      schema:
 *                          type: string
 *                          example: signup.ejs의 파일 내용...
 *          500:
 *              description: 서버 내부 오류입니다. 발생 시 백엔드에게 알려주십시오.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      status:
 *                                          type: integer
 *                                      message:
 *                                          type: string
 *                          example:
 *                              error: {
 *                                  status: 500,
 *                                  message: "오류 발생 내용..."
 *                              }
 */
router.get("/register", ctrl.rend.register);

/**
 * @swagger
 * /login:
 *   get:
 *      tags:
 *          - Index
 *      summary: 로그인 페이지를 불러옵니다.
 *      responses:
 *          200:
 *              description: 로그인 페이지를 불러오는 데 성공하였습니다.
 *              content:
 *                  text/html:
 *                      schema:
 *                          type: string
 *                          example: signin.ejs의 파일 내용...
 *          500:
 *              description: 서버 내부 오류입니다. 발생 시 백엔드에게 알려주십시오.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      status:
 *                                          type: integer
 *                                      message:
 *                                          type: string
 *                          example:
 *                              error: {
 *                                  status: 500,
 *                                  message: "오류 발생 내용..."
 *                              }
 */
router.get("/login", ctrl.rend.login);

module.exports = router;
