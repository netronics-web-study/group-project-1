const createError = require("http-errors");
const { token } = require("../../resources/jwt_management.js");
const user = require("../../models/users.model.js");

const allow = {
  onlyAuthUser: async function (req, res, next) {
    req.accessHandler = {
      forDevUser: false,
      forAdminUser: false,
    };
    next();
  },
  onlyDevUser: async function (req, res, next) {
    req.accessHandler = {
      forDevUser: true,
      forAdminUser: false,
    };
    next();
  },
  onlyAdminUser: async function (req, res, next) {
    req.accessHandler = {
      forDevUser: false,
      forAdminUser: true,
    };
    next();
  },
};

async function filterUser(req, res, next) {
  const foundUser = await user.findOne({ userID: req.payload.aud });

  if (!foundUser) {
    throw createError.InternalServerError(
      "토큰에 해당하는 유저를 찾지 못했습니다"
    );
  }

  req.foundUser = foundUser;
  foundUser.password = null;

  const filterActivated =
    req.accessHandler.forDevUser || req.accessHandler.forAdminUser;

  const allowDev = req.accessHandler.forDevUser && foundUser.isDev;
  const allowAdmin = req.accessHandler.forAdminUser && foundUser.isAdmin;

  if (filterActivated && (allowDev || allowAdmin)) {
    throw createError.Forbidden("해당 기능에 접근할 권한이 없습니다");
  }
  next();
}

async function handleError(error, req, res, next) {
  if (error.status === 401) {
    switch (error.message) {
      case "noAccessTokenError": {
        error.message = "요청에 Access Token이 누락되었습니다";
        return next(error);
      }
      case "expiredTokenError": {
        error.message =
          "Access Token이 만료되었습니다. 토큰 재발급 후 재시도하십시오";
        return next(error);
      }
      default: {
        return next(error);
      }
    }
  }
  return next(error);
}

module.exports = {
  allow,
  filterUser,
  handleError,
};
