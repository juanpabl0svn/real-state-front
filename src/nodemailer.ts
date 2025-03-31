import nodemailer from 'nodemailer';


export async function sendEmail(email: string, subject: string, body: string) {
  try {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: body
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendOtpEmail(email: string, otp: string) {
  const subject = "Vivea OTP verification";
  const body = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 20px;
        }
        .header {
          background-color: #4caf50;
          color: white;
          text-align: center;
          padding: 10px 0;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          color: #4caf50;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #888888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">Vivea OTP Verification</div>
        <div class="content">
          <p>Use the following OTP to complete your verification process:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
        <div class="footer">Thank you for using Vivea!</div>
      </div>
    </body>
  </html>
  `;
  return await sendEmail(email, subject, body);
}