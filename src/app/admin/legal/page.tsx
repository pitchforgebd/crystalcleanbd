import { getLegalPage } from "@/lib/repository/legal";
import { AdminLegalClient } from "@/app/admin/legal/AdminLegalClient";

export default async function AdminLegalPage() {
  const [terms, privacy] = await Promise.all([
    getLegalPage("terms"),
    getLegalPage("privacy"),
  ]);
  return (
    <AdminLegalClient
      initial={{
        terms: terms ?? { title: "Terms & Conditions", updated: "", sections: [] },
        privacy: privacy ?? { title: "Privacy Policy", updated: "", sections: [] },
      }}
    />
  );
}
