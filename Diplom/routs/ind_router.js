const express = require('express')
const controller = require('../controllers/ind')
const passport = require('passport')
const router = express.Router()

router.get('/ind', passport.authenticate('jwt', { session : false }), controller.ind)

module.exports = router