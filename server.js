require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("./config/passport")
const app = express()
const PORT = process.env.PORT || 5000
const authRoutes = require("./routes/user")
const setupSwaggerDocs = require("./swagger")

// 🛠️ Middleware
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
// Cấu hình Swagger
setupSwaggerDocs(app)

app.get("/", (req, res) => {
  res.send(`
    <h1>Login</h1>
    <a href='/auth/google'>Login with Google</a><br>
    <a href='/auth/facebook'>Login with Facebook</a>
  `)
})

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/")
  res.send(`Welcome ${req.user.displayName || "User"}`)
})

// 🚦 Routes
app.use("/", authRoutes)
app.use("/auth/google", require("./routes/loginGoogle"))
app.use("/auth/facebook", require("./routes/loginFacebook"))

// 🌐 Kết nối MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 MongoDB connected"))
  .catch(err => console.log("🔴 MongoDB connection error", err))

// 🚀 Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
