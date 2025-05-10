export const CLIENTS = new Map<string, (data: any) => void>();

export const sendNotification = (userId: string, data: any) => {
  if (CLIENTS.has(userId)) {
    const client = CLIENTS.get(userId);
    if (client) {
      client(data);
    }
  }
}
