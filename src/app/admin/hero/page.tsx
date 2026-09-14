import { getHeroContent } from "@/lib/repository/hero";
import { AdminHeroClient } from "@/app/admin/hero/AdminHeroClient";

export default async function AdminHeroPage() {
  const hero = await getHeroContent();
  return (
    <AdminHeroClient
      initial={
        hero ?? {
          heading: "",
          subheading: "",
          text: "",
          ctaLabel: "Learn more",
          ctaHref: "/services",
          image1: "",
          image1Alt: "",
          image2: "",
          image2Alt: "",
          image3: "",
          image3Alt: "",
        }
      }
    />
  );
}
