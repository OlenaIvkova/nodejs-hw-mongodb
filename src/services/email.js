import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
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

  await transporter.sendMail(mailOptions);
};