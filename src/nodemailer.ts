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

  try {

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
    await sendEmail(email, subject, body);

    return true;
  }
  catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}


export async function sendPropertyApprovedEmail(email: string, title: string): Promise<boolean> {
  try {
    const subject = "Tu propiedad ha sido aprobada"
    const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0; padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
          .property-title {
            font-size: 20px;
            font-weight: bold;
            color: #333333;
            margin: 15px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888888;
            text-align: center;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">¡Propiedad Aprobada!</div>
          <div class="content">
            <p>Tu inmueble ha pasado el proceso de revisión y ha sido <strong>aprobado</strong> con éxito.</p>
            <div class="property-title">${title}</div>
            <p>Ya puedes ver cómo aparece publicado en la plataforma.</p>
            <a href="https://tusitio.com/mis-propiedades" class="button">Ver mis propiedades</a>
          </div>
          <div class="footer">
            Gracias por confiar en nosotros.<br/>
            Equipo de Vivea
          </div>
        </div>
      </body>
    </html>
    `

    await sendEmail(email, subject, body)
    console.log("Email sent successfully")
    return true
  } catch (error) {
    console.error("Error sending approval email:", error)
    return false
  }
}

export async function sendPropertyRejectedEmail(email: string, title: string): Promise<boolean> {
  try {
    const subject = "Tu propiedad ha sido rechazada"
    const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0; padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 20px;
          }
          .header {
            background-color: #e53e3e;
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
          .property-title {
            font-size: 20px;
            font-weight: bold;
            color: #333333;
            margin: 15px 0;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #e53e3e;
            color: white;
            text-decoration: none;
            border-radius: 4px;
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
          <div class="header">Propiedad Rechazada</div>
          <div class="content">
            <p>Lamentamos informarte que tu inmueble no cumple con nuestros criterios de publicación.</p>
            <div class="property-title">${title}</div>
            <p>Por favor revisa las <a href="https://tusitio.com/guia-publicacion">directrices de publicación</a> y ajusta la información.</p>
            <a href="https://tusitio.com/mis-propiedades" class="button">Revisar mis propiedades</a>
          </div>
          <div class="footer">
            Si tienes dudas, contáctanos en soporte@tusitio.com.<br/>
            Equipo de Vivea
          </div>
        </div>
      </body>
    </html>
    `

    await sendEmail(email, subject, body)
    return true
  } catch (error) {
    console.error("Error sending rejection email:", error)
    return false
  }
}