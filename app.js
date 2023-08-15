var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();

/**
 * 호스트 컴퓨터의 mongodb를 사용합니다
 */
require("./resources/init_mongodb");
//require("./resources/keygen");

/**
 * body-parser: 클라이언트의 request로부터 body(실제 사용자가 전달하고자 한 정보, ex. 로그인 정보)를 추출하는 module
 */
const bodyParser = require("body-parser");

/**
 * 기능별 Router를 추가합니다.
 */
var indexRouter = require("./routes/index.route");
var usersRouter = require("./routes/users.route");

const authRouter = require("./routes/auth.route");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * body-parser가 한글을 정상적으로 처리할 수 있게끔 만드는 코드
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
