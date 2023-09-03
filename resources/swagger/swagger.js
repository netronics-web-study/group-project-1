const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "네트로닉스 홈페이지",
      description: "네트로닉스 홈페이지의 API 문서입니다",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js", "./routes/control/*.js", "./models/*.js"],
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
