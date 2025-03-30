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
      text: body
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    return false;
  }

}