const express = require("express")
const passport = require("passport")
const router = express.Router()

router.get("/", passport.authenticate("facebook", { scope: "email" }))

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook/error",
  }),
  (req, res) => {
    res.redirect("/")
  }
)

router.get("/success", (req, res) => {
  const userInfo = req.user
  res.render("fb-success", { user: userInfo })
})

router.get("/error", (req, res) => res.send("Error logging in via Facebook.."))

router.get("/signout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Failed to sign out fb user")
    req.session.destroy(() => res.redirect("/"))
  })
})

module.exports = router
