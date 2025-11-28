const contactusModel = require('../../models/userModel/contactusModel');
const { Resend } = require('resend');
const resend = new Resend("re_7FuDobS5_25UEar3f1uuxQ8nX89CKnCQC");

exports.createContactus = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body.formData;

    // save to db
    const result = await contactusModel.create({ name, email, mobile, message });

    // SEND EMAIL
    const emailResponse = await resend.emails.send({
      from: "Your Website <onboarding@resend.dev>",
      to: "mecom8489@gmail.com",
      subject: "New Contact Us Message",
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    return res.status(200).json({
      message: "Saved & Email Sent Successfully",
      enquiryId: result.insertId,
      emailInfo: emailResponse
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
