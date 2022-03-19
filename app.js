const notesRouter = require('./controllers/notes')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(result=>{
    logger.info('connected to mongodb')
})
.catch((error)=>{
    logger.error('error connecting to MongoDb',error.message)
})

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login',loginRouter)
app.use('/api/notes',notesRouter)
app.use('/api/users',userRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app