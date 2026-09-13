"use client";

import { FormEvent, useState } from "react";
import { FeedbackBanner, useServerAction } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { SiteSettings } from "@/lib/admin-types";
import type { SocialLink } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import { AdminSocialLinks } from "@/components/admin/AdminSocialLinks";
import { LogoSize } from "@/components/admin/LogoSize";
import { updateSiteSettings } from "@/server/actions/settings";

type Props = {
  initial: {
    siteSettings: SiteSettings;
    socialLinks: SocialLink[];
    ogImageLabel: string;
  };
};

export function AdminSettingsClient({ initial }: Props) {
  const [form, setForm] = useState(initial.siteSettings);
  const { feedback, message, isPending, execute } = useServerAction(updateSiteSettings, {
    successMessage: "Settings saved.",
    errorPrefix: "Save failed:",
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    execute({
      brandName: form.brandName,
      tagline: form.tagline,
      email: form.email,
      phone: form.phone,
      address: form.address,
      mainLogo: form.mainLogo,
      footerLogo: form.footerLogo,
      favicon: form.favicon,
      mainLogoHeight: form.mainLogoHeight,
      footerLogoHeight: form.footerLogoHeight,
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Website Settings"
        description="Brand identity, contact details, logos, and social links."
      />
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">Business details</h2>
          <div className="space-y-4">
            {(
              [
                ["brandName", "Brand name"],
                ["tagline", "Tagline"],
                ["email", "Email"],
                ["phone", "Phone"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={inputClass}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </Field>
            ))}
            <Field label="Address">
              <textarea
                className={textareaClass}
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({ ...current, address: event.target.value }))
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-deep)]">Branding</h2>
          <div className="space-y-4">
            <ImageField
              label="Main logo"
              hint="Shown in the website header. A transparent PNG works best."
              value={form.mainLogo}
              onChange={(url) => setForm((current) => ({ ...current, mainLogo: url }))}
            />
            <LogoSize
              label="Header logo height"
              value={form.mainLogoHeight}
              src={form.mainLogo}
              onChange={(height) =>
                setForm((current) => ({ ...current, mainLogoHeight: height }))
              }
            />
            <ImageField
              label="Footer logo"
              hint="Leave empty to reuse the main logo."
              value={form.footerLogo}
              onChange={(url) => setForm((current) => ({ ...current, footerLogo: url }))}
            />
            <LogoSize
              label="Footer logo height"
              value={form.footerLogoHeight}
              src={form.footerLogo || form.mainLogo}
              dark
              onChange={(height) =>
                setForm((current) => ({ ...current, footerLogoHeight: height }))
              }
            />
            <ImageField
              label="Favicon"
              hint="The small icon in the browser tab — a square image."
              value={form.favicon}
              onChange={(url) => setForm((current) => ({ ...current, favicon: url }))}
            />
          </div>
        </AdminCard>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save settings"}
          </button>
          <FeedbackBanner feedback={feedback} message={message} />
        </div>
      </form>

      <div className="mt-6">
        <AdminSocialLinks initial={initial.socialLinks} />
      </div>
    </div>
  );
}
