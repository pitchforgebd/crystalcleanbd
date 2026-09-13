"use client";

import { createContext, useContext } from "react";
import type { SiteInfo } from "@/lib/types";

const SiteInfoContext = createContext<SiteInfo | null>(null);

export function SiteInfoProvider({
  value,
  children,
}: {
  value: SiteInfo;
  children: React.ReactNode;
}) {
  return <SiteInfoContext.Provider value={value}>{children}</SiteInfoContext.Provider>;
}

export function useSiteInfo(): SiteInfo {
  const value = useContext(SiteInfoContext);
  if (!value) {
    return {
      brandName: "Crystal Clean Service",
      tagline: "",
      email: "",
      phone: "",
      address: "",
      mainLogo: "",
      footerLogo: "",
      favicon: "",
      mainLogoHeight: 32,
      footerLogoHeight: 40,
      mockNotice: "",
    };
  }
  return value;
}
