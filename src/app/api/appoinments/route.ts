import { auth } from "@/auth"; 
import { prisma } from "@/prisma";  
import moment from "moment";

export async function POST(req: Request) {
  try {
    const session = await auth(); 
    if (!session) return new Response("Unauthorized", { status: 401 });

    const userId = session.user.user_id!;

    const { date, startTime } = await req.json();
    if (!date || !startTime) {
      return new Response("Missing required fields", { status: 400 });
    }

    const endTime = moment(startTime, 'HH:mm').add(1, 'hour').format('HH:mm');

    const existingAppointment = await prisma.appoinments.findFirst({
      where: {
        user_id: userId,
        date: new Date(date),
        startTime: startTime,
      },
    });

    if (existingAppointment) {
      return new Response("Appointment already exists at this time", { status: 409 });
    }

    const newAppointment = await prisma.appoinments.create({
      data: {
        user_id: userId,
        date: new Date(date),  
        startTime,
        endTime,
      },
    });

    return new Response(JSON.stringify(newAppointment), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}