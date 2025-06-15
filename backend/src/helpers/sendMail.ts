import nodemailer from "nodemailer";
import config from "../config";

export const sendResetEmail = async (to: string, token: string) => {
	const transporter = nodemailer.createTransport({
		host: "mail.adshuntmedia.com",
		port: 465,
		secure: true,
		auth: {
			user: config.email,
			pass: config.password,
		},
	});

	const resetURL = `https://dashboard.searchhivemedia.com/reset-password/${token}`;
	const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">
          You recently requested to reset your password. Click the button below to proceed:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you didn’t request this, please ignore this email.
        </p>
        <p style="font-size: 14px; color: #999;">
          This link will expire in 1 hours.
        </p>
      </div>
    </div>
  `;

	const mailOptions = {
		to,
		from: `"Ads Hunt Media" <${config.email}>`,
		subject: "Password Reset",
		html,
	};

	await transporter.sendMail(mailOptions);
};
