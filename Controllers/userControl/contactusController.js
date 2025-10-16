const nodemailer = require('nodemailer');
const contactusModel = require('../../models/userModel/contactusModel');

exports.createContactus = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body.formData;

    // 1. Save to database
    const result = await contactusModel.create({ name, email, mobile, message });

    // 2. Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Define email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for contacting us!',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p>
        <h4>Your Message:</h4>
        <p>${message}</p>
        <hr/>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p>Regards,<br/>Eshop easy</p>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    // 5. Respond to the client
    return res.status(200).json({
      message: 'Enquiry submitted and confirmation email sent!',
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
