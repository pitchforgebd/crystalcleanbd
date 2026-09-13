import { listContactMessages } from "@/lib/repository/contact";
import { AdminMessagesClient } from "@/app/admin/messages/AdminMessagesClient";
import { readMailConfig } from "@/server/email";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();
  const mail = readMailConfig();

  return (
    <AdminMessagesClient
      initial={messages}
      mail={mail ? { configured: true, to: mail.to } : { configured: false }}
    />
  );
}
