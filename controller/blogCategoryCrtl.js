import BCategory from '../models/blogCategoryModel.js'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'
import { productCategoryValidate } from '../validation/productCategoryVali.js'


export const createCategory = async(req, res, next) => {
  try {
    const validateData = await productCategoryValidate.validateAsync(req.body)
    const newCategory = await BCategory.create(validateData)
    res.status(200).json({ status: 'success', category: newCategory })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.bcategoryId)
    const updatedCategory = await BCategory.findByIdAndUpdate({ _id: req.params.bcategoryId}, req.body, { new: true })
    res.status(200).json({ status: 'success', updatedPcategory: updatedCategory })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.bcategoryId)
    const deletedCategory = await BCategory.findByIdAndDelete({ _id: req.params.bcategoryId })
    res.status(200).json({ status: 'success', deletedCategory: deletedCategory })
  } catch (error) {
    next(error)
  }
}

export const getCategory = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.bcategoryId)
    const category = await BCategory.find({ _id: req.params.bcategoryId })
    res.status(200).json({ status: 'success', category: category })
  } catch (error) {
    next(error)
  }
}

export const getAllCategory = async(req, res, next) => {
  try {
    const categories = await BCategory.find()
    res.status(200).json({ status: 'success', categories: categories })
  } catch (error) {
    next(error)
  }
}