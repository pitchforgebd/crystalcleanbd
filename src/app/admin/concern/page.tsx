import { getConcernContent } from "@/lib/repository/concern";
import { AdminConcernClient } from "@/app/admin/concern/AdminConcernClient";

export default async function AdminConcernPage() {
  const concern = await getConcernContent();
  return (
    <AdminConcernClient
      initial={
        concern ?? {
          name: "",
          tagline: "",
          introduction: "",
          brandingNote: "",
          image: "",
          imageAlt: "",
          ctaLabel: "",
          ctaHref: "",
          features: [],
        }
      }
    />
  );
}
