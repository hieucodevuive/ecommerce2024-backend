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

export const getAllProduct = async(req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit
    //Xử lý biến đổi price để lọc dữ liệu
    const handleQueryPrice = (obj) => {
      let queryStr = JSON.stringify(obj)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
      console.log(queryStr)
      return JSON.parse(queryStr)
    }
    //Lọc các dựa trên cách trường

    
    const products = await Product.find({
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.brand && { brand: req.query.brand }),
      ...(req.query.price && { price: handleQueryPrice(req.query.price) }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { category: { $regex: req.query.searchTerm, $options: 'i' } },
          { brand: { $regex: req.query.searchTerm, $options: 'i' } },
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit)
      if (req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) next(errorHandler(400, 'Page not found'))
      }

    res.status(200).json({ status: 'success', products: products })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    validateMongoDbId(req.params.productId)
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updateProduct = await Product.findByIdAndUpdate({ _id: req.params.productId}, req.body, { new: true })
    return res.status(200).json({ status: 'success', newProduct: updateProduct})
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    validateMongoDbId(req.params.productId)
    const deleteProduct = await Product.findByIdAndDelete({ _id: req.params.productId})
    return res.status(200).json({ status: 'success', deleteProduct })
  } catch (error) {
    next(error)
  }
}