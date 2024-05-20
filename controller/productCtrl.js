import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { productValidate } from '../validation/productVali.js'
import slugify from 'slugify'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'
import { cloudinaryUploadImg } from '../utils/cloudinary.js'
import fs from 'fs'

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
      .populate('ratings.postedby')
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

export const addToWishlist = async (req, res, next) => {
  const userId = req.user._id
  const productId = req.params.productId
  //TH1: product đã tồn tại trong wishlist
  const user = await User.findById(userId)
  const addedToWishlist =  user?.wishlist.find((objectId) => objectId.toString() === productId.toString())
  if (addedToWishlist) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { wishlist: productId },
      },
      { new: true }
    )
    return res.json({ status: 'success', message: 'remove product from wishlist', user: user })
  } else {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { wishlist: productId },
      },
      { new: true }
    )
    console.log(user);
    return res.json({ status: 'success', message: 'add product from wishlist', user: user })
  }
}

export const rating = async (req, res, next) => {
  const productId = req.params.productId
  const userId = req.user._id
  const { star, comment } = req.body
  if (!star || !comment) return next(errorHandler(500, 'All fields are required'))
  validateMongoDbId(productId)

  try {
    const product = await Product.findById(productId)
    if (!product) return next(errorHandler(400, 'Product not found'))

    const user = await User.findById(userId)
    if (!user) return next(errorHandler(400, 'You need to login first'))

    let alreadyRated = product.ratings.find(
      (user) => user.postedby.toString() === userId.toString()
    )

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      )
    } else {
      const ratedProduct = await Product.findByIdAndUpdate({ _id: productId },
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: user._id
            }, 
          },
        },
        {
          new: true
        }
      )
    }

    const getallratings = await Product.findById(productId)
    let totalRating = getallratings.ratings.length
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let averageRating = Math.round(ratingsum / totalRating*10)/10
    let finalproduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalrating: totalRating,
      },
      { new: true }
    )
    return res.status(200).json({ status: 'success', finalproduct: finalproduct, averageRating: averageRating })
  } catch (error) {
    next(error)
  }
}

export const uploadImage = async (req, res, next) => {
  const productId = req.params.productId
  validateMongoDbId(productId)
  try {
    const uploaded = (path) => cloudinaryUploadImg(path, 'images')
    const urls = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      console.log('🚀 ~ uploadImage ~ path:', path)
      const newpath = await uploaded(path)
      urls.push(newpath)
      try {
        fs.unlinkSync(path)
      } catch (error) {
        console.log(error)
      }
    }
    const findProduct = await Product.findByIdAndUpdate({ _id: productId }, {
      images: urls.map(file => {
        return file
      })
    }, { new: true })
    res.status(200).json({ status: 'success', product: findProduct })
  } catch (error) {
    next(error)
  }
}