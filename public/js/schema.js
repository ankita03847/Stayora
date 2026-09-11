const joi = require('joi');

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required().messages({
      "string.empty": "Title is required.",
      "any.required": "Title is required."
    }),
    description: joi.string().required().messages({
      "string.empty": "Please enter a description.",
      "any.required": "Description is required."
    }),
    location: joi.string().required().messages({
      "string.empty": "Location is required.",
      "any.required": "Location is required."
    }),
    country: joi.string().required().messages({
      "string.empty": "Country is required.",
      "any.required": "Country is required."
    }),
    price: joi.number().required().min(0).messages({
      "number.base": "Price must be a valid number.",
      "number.min": "Price must be 0 or higher.",
      "any.required": "Price is required."
    }),
    category: joi.string().allow("", null).optional(),
    image: joi.any().optional()
  }).required()
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().integer().min(1).max(5),
    comment: joi.string().required()
  }).required()
});