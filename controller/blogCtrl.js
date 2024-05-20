import Blog from '../models/blogModel.js'
import User from '../models/userModel.js'
import { errorHandler } from '../utils/errorHandle.js'

import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { blogValidate } from '../validation/blogVali.js'

import { cloudinaryUploadImg } from '../utils/cloudinary.js'


export const createBlog = async(req, res, next) => {
  try {
    const validateData = await blogValidate.validateAsync(req.body)
    const newBlog = await Blog.create(validateData)
    return res.status(200).json({status: 'success', blog: newBlog})
  } catch (error) {
    next(error)
  }
}

export const updateBlog = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.blogId)
    const updateBlog = await Blog.findOneAndUpdate({ _id: req.params.blogId }, req.body, { new: true })
    return res.status(200).json({status: 'success', updateBlog: updateBlog})
  } catch (error) {
    next(error)
  }
}

export const getBlog = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.blogId)
    const blog = await Blog.findById(req.params.blogId)
      .populate('likes')
      .populate('dislikes')
    blog.numViews += 1
    blog.save()
    return res.status(200).json({status: 'success', blog: blog})
  } catch (error) {
    next(error)
  }
}

export const getAllBlog = async(req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit
    
    const blogs = await Blog.find({
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { category: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort('-updatedAt')
      .skip(skip)
      .limit(limit)
      if (req.query.page) {
        const blogCount = await Blog.countDocuments();
        if (skip >= blogCount) next(errorHandler(400, 'Page not found'))
      }

    res.status(200).json({ status: 'success', blogs: blogs })
  } catch (error) {
    next(error)
  }
}

export const deleteBlog = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.blogId)
    const deleteBlog = await Blog.findByIdAndDelete(req.params.blogId)
    return res.status(200).json({status: 'success', deleteBlog: deleteBlog})
  } catch (error) {
    next(error)
  }
}

export const likeBlog = async (req, res, next) => {
  try {
    validateMongoDbId(req.params.blogId)
    const blog = await Blog.findOne({ _id: req.params.blogId})
    const userId = req?.user?._id
    //Kiem tra xem user co dislike hay khong
    const isDislike = blog?.dislikes.find((objectId) => objectId.toString() === userId.toString())
    if (isDislike) {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $pull: { dislikes: userId },
          $push: { likes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'undisliked and liked'})
    }
    //Kiem tra xem user nay da like blog nay hay chua
    const isLike = blog?.likes.find((objectId) => objectId.toString() === userId.toString())
    if (isLike) {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $pull: { likes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'unliked'})
    } else {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $push: { likes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'liked'})
    }
  } catch (error) {
    next(error)
  }
}

export const dislikeBlog = async (req, res, next) => {
  try {
    validateMongoDbId(req.params.blogId)
    const blog = await Blog.findOne({ _id: req.params.blogId})
    const userId = req?.user?._id
    //Kiem tra xem user co like hay khong
    const isLike = blog?.likes.find((objectId) => objectId.toString() === userId.toString())
    if (isLike) {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $push: { dislikes: userId },
          $pull: { likes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'unliked and disliked'})
    }
    //Kiem tra xem user nay da like blog nay hay chua
    const isDisLike = blog?.dislikes.find((objectId) => objectId.toString() === userId.toString())
    if (isDisLike) {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $pull: { dislikes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'undisliked'})
    } else {
      const blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $push: { dislikes: userId }
        },
        { new: true }
      )
      return res.json({ status: 'success', message: 'disliked'})
    }
  } catch (error) {
    next(error)
  }
}

export const uploadImage = async (req, res, next) => {
  const blogId = req.params.blogId
  validateMongoDbId(blogId)
  try {
    const uploaded = (path) => cloudinaryUploadImg(path, 'images')
    const urls = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newpath = await uploaded(path)
      urls.push(newpath)
    }
    const findBlog = await Blog.findByIdAndUpdate({ _id: blogId }, {
      images: urls.map(file => {
        return file
      })
    }, { new: true })
    res.status(200).json({ status: 'success', blog: findBlog })
  } catch (error) {
    next(error)
  }
}