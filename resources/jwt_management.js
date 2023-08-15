const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const token = {
  genAccessToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        issuer: "netronics.com",
        audience: userID,
      };

      jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          console.log(error.message);
          reject(createError.InternalServerError("토큰 생성 오류"));
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"])
      return next(createError.Unauthorized("잘못된 요청입니다"));
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        return next(createError.Unauthorized("잘못된 토큰입니다"));
      }
      req.payload = payload;
      next();
    });
  },
};

module.exports = {
  token,
};
