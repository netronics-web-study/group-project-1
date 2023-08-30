const user = require("../../models/users.model.js");

const rend = {
  /**
   * 마이페이지와 함께 유저의 정보를 전송합니다
   */
  mypage: async function (req, res, next) {
    res.render("mypage", {
      success: true,
      userInfo: req.foundUser,
    });
  },
};

module.exports = {
  rend,
};
