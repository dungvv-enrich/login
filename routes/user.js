/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
const express = require("express")
const cors = require("cors")
const app = express()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()
app.use(cors())

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("Error:", err)
    }
    res.redirect("/")
  })
})

router.post("/signup", async (req, res) => {
  const { username, password, email, name, accountId } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({
        data: true,
        status: 200,
        message: "Email already in use",
      })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      accountId,
      provider: "signup",
    })
    console.log({ newUser })

    await newUser.save()
    res.json({
      data:
        {
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
        } || {},
      status: 200,
      message: "Registration successful!",
    })
  } catch (error) {
    console.error("Error during signup:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: "User does not exist" })
    }

    if (!user.password) {
      console.error("User does not have a password field:", user)
      return res.status(400).json({ message: "Password not set for this user" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    })

    res.status(200).json({
      userName: user.username || user.name,
      email: user.email,
      accountId: user.accountId,
      message: "Login successful",
      token,
    })
  } catch (error) {
    console.error("Error during login:", error)
    res.status(500).json({ message: "Server error. Please try again later." })
  }
})

router.delete("/delete/:accountId", async (req, res) => {
  const { accountId } = req.params
  console.log(accountId)
  try {
    const deletedUser = await User.findOneAndDelete({
      accountId: String(accountId),
    })
    if (!deletedUser) return res.status(404).json({ message: "User not found" })

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password: hashedPassword },
      { new: true }
    )

    if (!updatedUser) return res.status(404).json({ message: "User not found" })

    res
      .status(200)
      .json({ message: "User update successful", data: updatedUser })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
