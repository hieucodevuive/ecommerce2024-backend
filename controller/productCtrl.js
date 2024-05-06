import Product from '../models/productModel.js'
import { productValidate } from '../validation/productVali.js'
import slugify from 'slugify'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'

export const createProduct = async(req, res, next) => {
  //B1: check xem đã đăng nhập chưa và có phải là admin không
  //B2: lấy thông tin product
  //B3: thêm vào DB
  try {
    const validateData = await productValidate.validateAsync(req.body)
    const { title } = validateData
    const slug = slugify(title)
    const product = { ...validateData, slug }
    const newProduct = await Product.create(product)
    return res.status(200).json({ status: 'success', product: newProduct })
  } catch (error) {
    next(error)
  }
}

export const  getProductDetail = async (req, res, next) => {
  validateMongoDbId(req.params.productId)
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return next(errorHandler(400, 'Product not found'))
    return res.status(200).json({ status: 'success', product: product})
  } catch (error) {
    next(error)
  }
}