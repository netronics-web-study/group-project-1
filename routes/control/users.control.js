const user = require("../../models/users.model.js");

const rend = {
  mypage: async function (req, res, next) {
    const userID = req.payload.aud;
    const foundUser = user.findOne({ userID: userID });

    res.render("mypage", {
      userID: userID,
      name: foundUser.name,
    });
  },
};

module.exports = {
  rend,
};
