const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const authRoutes = require('./routs/auth.js')
const camera = require('./routs/camera_router')
const neyro_rout = require('./routs/neyro_router')
const ind = require('./routs/ind_router')
const lesteners = require('./routs/listeners_router.js')
const app = express()

app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/camera', camera)
app.use('/api/ind', ind)
app.use('/api/neyro', neyro_rout)
app.use('/api/listeners', lesteners)




module.exports = app