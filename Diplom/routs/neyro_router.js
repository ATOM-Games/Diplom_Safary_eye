const express = require('express')
const controller = require('../controllers/neyro_controller')
const passport = require('passport')
const router = express.Router()

router.post('/message_module', /*passport.authenticate('jwt', { session : false }),*/ controller.message_module)
router.post('/getResult', /*passport.authenticate('jwt', { session : false }),*/ controller.get_glob_res)
router.post('/submit', controller.submit)
router.post('/getallmod', controller.getAllModules)
router.post('/getlocalip', controller.getLocalIP)
router.post('/getStatus', controller.getStatus)
router.post('/addModule', controller.addModule)
router.post('/editModule', controller.editModule)
router.post('/deleteModule', controller.deleteModule)

module.exports = router