import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { SocialLink } from "@/lib/types";

const socialIconMap: Record<SocialLink["platform"], IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

type SocialIconProps = {
  platform: SocialLink["platform"];
  className?: string;
};

export function SocialIcon({ platform, className = "h-4 w-4" }: SocialIconProps) {
  const Icon = socialIconMap[platform];
  return <Icon className={className} aria-hidden />;
}
