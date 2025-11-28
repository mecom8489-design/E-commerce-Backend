const nodemailer = require("nodemailer");
const contactusModel = require('../../models/userModel/contactusModel');

exports.createContactus = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body.formData;

    // 1. Save to database
    const result = await contactusModel.create({ name, email, mobile, message });

    // 2. Email Transporter (use your Gmail or SMTP credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mecom8489@gmail.com",       // your email
        pass: "yvmo vjoo pqee utbg"          // Gmail App Password
      }
    });

    // 3. Email Option
    const mailOptions = {
      from: `"Website Enquiry" <yourgmail@gmail.com>`,
      to: "sivaathri@gmail.com",          // send to admin or company email
      subject: "New Contact Us Message",
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    // 5. Respond to the client
    return res.status(200).json({
      message: "Saved & Email Sent Successfully",
      enquiryId: result.insertId
    });

  } catch (error) {
    console.error('Error in createContactus:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
