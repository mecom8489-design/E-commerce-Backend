
const contactusModel = require('../../models/userModel/contactusModel');

exports.createContactus = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body.formData;

    // 1. Save to database
    const result = await contactusModel.create({ name, email, mobile, message });

   
    // 5. Respond to the client
    return res.status(200).json({
      message: "saved ",
      enquiryId: result._id, // Use _id for MongoDB documents
    });

  } catch (error) {
    console.error('Error in createContactus:', error);

    // Differentiate email errors (optional)
    if (error.response && error.response.includes('Invalid login')) {
      return res.status(500).json({ message: 'Email server error. Please check credentials.' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};
