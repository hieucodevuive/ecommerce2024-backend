import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { dbConnect  } from './config/dbConnect.js'
import { middlewareErrorHandler } from './middlewares/middlewareErrorHandler.js'

import authRouter from './routes/authRoute.js'
import productRouter from './routes/productRoute.js'
import blogRouter from './routes/blogRoute.js'

import cookieParser from 'cookie-parser'
import morgan from 'morgan'

dotenv.config()
await dbConnect()

const PORT = process.env.PORT || 3000
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//User router api
app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`)
})

//middleware error handler
app.use(middlewareErrorHandler)