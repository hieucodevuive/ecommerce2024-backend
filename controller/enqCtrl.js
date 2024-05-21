import Enquiry from '../models/enqModel.js'

export const createEnquiry = async (req, res, next) => {
  try {
    const newEnquiry = await Enquiry.create(req.body)
    res.status(200).json({ status: 'success', newEnquiry: newEnquiry })
  } catch (error) {
    next(error)
  }
}

export const updateEnquiry = async(req, res, next) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate({ _id: req.params.enquiryId }, req.body, { new: true })
    res.status(200).json({ status: 'success', updatedEnquiry: updatedEnquiry })
  } catch (error) {
    next(error)
  }
}

export const getAllEnquiry = async(req, res, next) => {
  try {
    const Enquirys = await Enquiry.find()
    res.status(200).json({ status: 'success', Enquirys: Enquirys })
  } catch (error) {
    next(error)
  }
}

export const getEnquiry = async(req, res, next) => {
  try {
    const Enquiry = await Enquiry.find({ _id: req.params.enquiryId })
    res.status(200).json({ status: 'success', Enquiry: Enquiry })
  } catch (error) {
    next(error)
  }
}

export const deleteEnquiry = async(req, res, next) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete({ _id: req.params.enquiryId })
    res.status(200).json({ status: 'success', deletedEnquiry: deletedEnquiry })
  } catch (error) {
    next(error)
  }
}