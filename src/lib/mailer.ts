import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, resetLink: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetLink}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset: Token valid for 1 hour",
    text: `You requested a password reset. Click the link to reset your password: ${link}`,
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${link}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Reset Password</a>
      <p>This link is valid for 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function confirmPasswordResetEmail(email: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Successful",
    text: "Your password has been reset successfully. You can now log in with your new password.",
    html: `
      <h1>Password Reset Successful</h1>
      <p>Your password has been reset successfully.</p>
      <p>You can now log in with your new password.</p>
      <a href="${link}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Login Now</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}