import nodemailer from "nodemailer";

export async function sendVerificationCode(email, code) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "oaddonay@gmail.com",
        pass: process.env.GMAIL_STMP_PASSWORD, 
      },
    });

    const info = await transporter.sendMail({
      from: "Dante's Team <oaddonay@gmail.com>", 
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Your Verification Code</h3>
          <p>Hello,</p>
          <p>Use the code below to verify your email address:</p>
          <h2 style="color: #4CAF50;">${code}</h2>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Thanks,</p>
          <p>The Team</p>
        </div>
      `,
    });

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    throw new Error(
      "Failed to send verification code. Please try again later."
    );
  }
}
