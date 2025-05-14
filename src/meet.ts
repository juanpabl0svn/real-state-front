import { appoinments } from "@prisma/client/default";
import { google } from "googleapis";
import { sendEmail } from "./nodemailer";

export async function createGoogleMeet(accessToken: string, title: string, date: string, startTime: string, endTime: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  const eventStart = new Date(`${date}T${startTime}:00`);
  const eventEnd = new Date(`${date}T${endTime}:00`);

  const event = {
    summary: title,
    start: {
      dateTime: eventStart.toISOString(),
      timeZone: "America/Bogota",
    },
    end: {
      dateTime: eventEnd.toISOString(),
      timeZone: "America/Bogota",
    },
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
}

export async function sendMeetByEmail(appoinment: appoinments, email: string) {
  try {
    const subject = "Reunion agendada equipo Vivea"
  const body = `<!DOCTYPE html>
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
            <p>Has sido agendado para una reunion con el equipo vivea.</p>
            <p>Dia: ${appoinment.date}.</p>
            <p>Hora de inicio: ${appoinment.startTime}.</p>
            <p>Hora final: ${appoinment.endTime}.</p>
            <a href="${appoinment.meetEvent}" class="button">Dar click para entrar a la reunion</a>
          </div>
          <div class="footer">
            Gracias por confiar en nosotros.<br/>
            Equipo de Vivea
          </div>
        </div>
      </body>
    </html>
    `;
    await sendEmail(email, subject, body);
    console.log("Se envio email correctamente");
    return true
  } catch(error) {
    console.error("Error al enviar email:", error)
    return false
  }
    
}