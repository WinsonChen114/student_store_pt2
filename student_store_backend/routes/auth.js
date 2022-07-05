const express = require("express")
const User = require("../models/user")
const router = express.Router()
const { createUserJwt } = require("../utils/tokens")
const { requireAuthenticatedUser } = require("../middleware/security")

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    const token = createUserJwt(user)
    return res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body, isAdmin: false })
    const token = createUserJwt(user)
    return res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
})

router.get("/me", requireAuthenticatedUser, async (request, response, next) => {
  try {
    const { email } = response.locals.user
    const user = await User.fetchUserbyEmail(email)
    console.log(user)
    const publicUser = User.makePublicUser(user)
    return response.status(200).json({ user: publicUser })

  }
  catch (err) {
    next(err)
  }
})
module.exports = router
