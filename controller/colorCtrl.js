import Color from '../models/colorModel.js'

export const createColor = async (req, res, next) => {
  try {
    const newColor = await Color.create(req.body)
    res.status(200).json({ status: 'success', newColor: newColor })
  } catch (error) {
    next(error)
  }
}

export const updateColor = async(req, res, next) => {
  try {
    const updatedColor = await Color.findByIdAndUpdate({ _id: req.params.colorId }, req.body, { new: true })
    res.status(200).json({ status: 'success', updatedColor: updatedColor })
  } catch (error) {
    next(error)
  }
}

export const getAllColor = async(req, res, next) => {
  try {
    const colors = await Color.find()
    res.status(200).json({ status: 'success', colors: colors })
  } catch (error) {
    next(error)
  }
}

export const getColor = async(req, res, next) => {
  try {
    const color = await Color.find({ _id: req.params.colorId })
    res.status(200).json({ status: 'success', color: color })
  } catch (error) {
    next(error)
  }
}

export const deleteColor = async(req, res, next) => {
  try {
    const deletedColor = await Color.findByIdAndDelete({ _id: req.params.colorId })
    res.status(200).json({ status: 'success', deletedColor: deletedColor })
  } catch (error) {
    next(error)
  }
}