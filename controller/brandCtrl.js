import Brand from '../models/brandModel.js'
import { validateMongoDbId } from '../utils/validateMongodbId.js'
import { errorHandler } from '../utils/errorHandle.js'
import { productCategoryValidate } from '../validation/productCategoryVali.js'


export const creatBrand = async(req, res, next) => {
  try {
    const validateData = await productCategoryValidate.validateAsync(req.body)
    const newBrand = await Brand.create(validateData)
    res.status(200).json({ status: 'success', newBrand: newBrand })
  } catch (error) {
    next(error)
  }
}

export const updateBrand = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.brandId)
    const updatedBrand = await Brand.findByIdAndUpdate({ _id: req.params.brandId}, req.body, { new: true })
    res.status(200).json({ status: 'success', updatedBrand: updatedBrand })
  } catch (error) {
    next(error)
  }
}

export const getAllBrand = async(req, res, next) => {
  try {
    const brands = await Brand.find()
    res.status(200).json({ status: 'success', brands: brands })
  } catch (error) {
    next(error)
  }
}

export const getBrand = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.brandId)
    const brand = await Brand.find({ _id: req.params.brandId })
    res.status(200).json({ status: 'success', brand: brand })
  } catch (error) {
    next(error)
  }
}

export const deleteBrand = async(req, res, next) => {
  try {
    validateMongoDbId(req.params.brandId)
    const deletedBrand = await Brand.findByIdAndDelete({ _id: req.params.brandId })
    res.status(200).json({ status: 'success', deletedBrand: deletedBrand })
  } catch (error) {
    next(error)
  }
}