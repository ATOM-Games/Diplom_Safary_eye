const express = require('express')
const controller = require('../controllers/camera_controls')
const passport = require('passport')
const router = express.Router()

router.post('/get_imgres', /*passport.authenticate('jwt', { session : false }),*/ controller.get_result)
router.post('/get_img', /*passport.authenticate('jwt', { session : false }),*/ controller.get_image)
router.post('/set_img', /*passport.authenticate('jwt', { session : false }),*/ controller.set_image)

module.exports = router