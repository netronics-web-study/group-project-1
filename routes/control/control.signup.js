const users = {
  id: [1234],
  password: [1234],
};

const process = {
  /**
   * 로그인 정보가 서버에 도착하면(POST) 이를 처리합니다
   */
  signup: function (req, res, next) {
    const id = req.body.id;
    const password = req.body.password;

    if (users.id.includes(id)) {
      const idx = users.id.indexOf(id);
      if (users.password[idx] === password) {
        return res.json({
          success: true,
        });
      }
    }
    return res.json({
      success: false,
    });
  },
};

module.exports = {
  process,
};
