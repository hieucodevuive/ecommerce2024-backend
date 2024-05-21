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
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import colorRouter from './routes/colorRoute.js'
import enqRouter from './routes/enqRoute.js'

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import {v2 as cloudinary} from 'cloudinary'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SERCET,
})

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
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/color', colorRouter)
app.use('/api/enq', enqRouter)

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`)
})

//middleware error handler
app.use(middlewareErrorHandler)