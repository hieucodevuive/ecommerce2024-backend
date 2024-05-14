import PCategory from '../models/productCategoryModel.js'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'
import { productCategoryValidate } from '../validation/productCategoryVali.js'


export const createCategory = async(req, res, next) => {
  try {
    const validateData = await productCategoryValidate.validateAsync(req.body)
    const newCategory = await PCategory.create(validateData)
    res.status(200).json({ status: 'success', category: newCategory })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.pcategoryId)
    const updatedCategory = await PCategory.findByIdAndUpdate({ _id: req.params.pcategoryId}, req.body, { new: true })
    res.status(200).json({ status: 'success', updatedPcategory: updatedCategory })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.pcategoryId)
    const deletedCategory = await PCategory.findByIdAndDelete({ _id: req.params.pcategoryId })
    res.status(200).json({ status: 'success', deletedCategory: deletedCategory })
  } catch (error) {
    next(error)
  }
}

export const getCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.pcategoryId)
    const category = await PCategory.find({ _id: req.params.pcategoryId })
    res.status(200).json({ status: 'success', category: category })
  } catch (error) {
    next(error)
  }
}

export const getAllCategory = async(req, res, next) => {
  try {
    const categories = await PCategory.find()
    res.status(200).json({ status: 'success', categories: categories })
  } catch (error) {
    next(error)
  }
}