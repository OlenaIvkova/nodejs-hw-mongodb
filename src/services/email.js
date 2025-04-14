import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  authMethod: "LOGIN",
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your password',
    html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err); 
    throw new Error("Failed to send reset email.");
  }
};