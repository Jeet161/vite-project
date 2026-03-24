import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendApprovalEmail = async (toEmail, uniqueId, password) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Your Account Has Been Approved",
    html: `
      <h2>Welcome!</h2>
      <p>Your registration has been approved.</p>
      <p>Here are your login credentials:</p>
      <p><strong>Unique ID:</strong> ${uniqueId}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please login and change your password.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};