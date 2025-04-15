import nodemailer from 'nodemailer';
import { getEnvVar } from '../helpers/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
   port: Number(getEnvVar('SMTP_PORT', 587)),
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export const sendResetEmail = async (options) => {
  return await transporter.sendMail(options);
};