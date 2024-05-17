import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { dbConnect  } from './config/dbConnect.js'
import { middlewareErrorHandler } from './middlewares/middlewareErrorHandler.js'

import authRouter from './routes/authRoute.js'
import productRouter from './routes/productRoute.js'
import blogRouter from './routes/blogRoute.js'
import pcategoryRouter from './routes/productCategoryRoute.js'
import bcategoryRouter from './routes/blogCategoryRoute.js'
import brandRouter from './routes/brandRoute.js'
import couponRouter from './routes/couponRoute.js'

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
app.use('/api/product-category', pcategoryRouter)
app.use('/api/blog-category', bcategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`)
})

//middleware error handler
app.use(middlewareErrorHandler)