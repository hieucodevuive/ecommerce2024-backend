import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { dbConnect  } from './config/dbConnect.js'
import { middlewareErrorHandler } from './middlewares/middlewareErrorHandler.js'
import authRouter from './routes/authRoute.js'

dotenv.config()
await dbConnect()

const PORT = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//User router api
app.use('/api/user', authRouter)

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`)
})

//middleware error handler
app.use(middlewareErrorHandler)