const rend = {
  //Route to main index
  index: function (req, res, next) {
    res.render("index(ar)", { title: "네트로닉스" });
  },

  //Route to sign-up page
  signup: function (req, res, next) {
    res.render("signup", { title: "네트로닉스 로그인" });
  },
};

module.exports = {
  rend,
};
