const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const token = {
  /**
   *사용자 ID 정보를 포함하는 Access Token을 발행합니다
   */
  genAccessToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "5m",
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

  /**
   *Access Token의 유효성을 검증합니다
   */
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) {
      return next(createError.Unauthorized("noAccessTokenError"));
    }

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        const message =
          error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
        if (error.message === "jwt expired") {
          return next(createError.Unauthorized("expiredTokenError"));
        } else {
          return next(createError.Unauthorized(message));
        }
      }
      req.payload = payload;
      console.log(payload);
      next();
    });
  },

  /**
   *사용자 ID 정보를 포함하는 Refresh Token을 발행합니다
   */
  genRefreshToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "3d",
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

  /**
   *Refresh Token의 유효성을 검증합니다
   */
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, payload) => {
          if (error) {
            return reject(createError.Unauthorized());
          }
          const userID = payload.aud;
          resolve(userID);
        }
      );
    });
  },
};

module.exports = {
  token,
};
