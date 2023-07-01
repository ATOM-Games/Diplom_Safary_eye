const express = require('express')
const controller = require('../controllers/listeners_controller')
const passport = require('passport')
const router = express.Router()



router.post('/getAllListeners', controller.getAllListeners)
router.post('/addListener', controller.addListener)
//router.post('/addModule', controller.addModule)
//router.post('/editModule', controller.editModule)
//router.post('/deleteModule', controller.deleteModule)
router.post('/get_all_names_module_by_phone', controller.get_all_names_module_by_phone)

router.post('/podpiska', controller.podpiska)
router.post('/otpiska', controller.otpiska)

module.exports = router