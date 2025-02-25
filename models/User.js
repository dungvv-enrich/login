const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: false },
  provider: { type: String, required: true },
  name: { type: String, required: true },
  accountId: { type: String, required: true },
  email: { type: String, required: false },
  avatar: { type: String, required: false },
  password: { type: String, required: false },
})

module.exports = mongoose.model("User", userSchema)
