const rend = {
  /**
   * 메인 페이지를 전송합니다
   */
  index: function (req, res, next) {
    res.render("index(ar)", { title: "네트로닉스" });
  },

  /**
   * 회원가입 페이지를 전송합니다
   */
  signup: function (req, res, next) {
    res.render("signup", { title: "네트로닉스 회원가입" });
  },

  /**
   * 로그인 페이지를 전송합니다
   */
  signin: function (req, res, next) {
    res.render("signin", { title: "네트로닉스 로그인" });
  },
};

module.exports = {
  rend,
};
