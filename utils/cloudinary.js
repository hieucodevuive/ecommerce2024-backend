import {v2 as cloudinary} from 'cloudinary'

export const cloudinaryUploadImg = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, { resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        })
      }
    })
  })
}

export const cloudinaryDeleteImg = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(file, { resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}