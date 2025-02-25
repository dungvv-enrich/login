const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// Cấu hình Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for your API",
    },
    servers: [
      {
        url: "http://localhost:5000", // URL server (đổi thành link production khi deploy)
      },
    ],
  },
  apis: ["./routes/*.js"], // Chỉ định file chứa định nghĩa API (Sử dụng đường dẫn tới các file routes của bạn)
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwaggerDocs = app => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log("📄 Swagger Docs available at http://localhost:5000/api-docs")
}

module.exports = setupSwaggerDocs
