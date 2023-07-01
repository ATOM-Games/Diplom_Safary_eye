const express = require('express')
const controller = require('../controllers/auth')
const upload = require('../middleware/upload')
const router = express.Router()

router.post('/login', controller.login)
router.post('/register', upload.single('image'), controller.register)
router.post('/getByToken', controller.getByToken)





module.exports = router