"use client";

import { FormEvent, useState } from "react";
import { FeedbackBanner, useServerAction } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { SeoSettings, PageSeoRow } from "@/lib/admin-types";
import { updatePageSeo, updateSeoSettings } from "@/server/actions/seo";

type Props = {
  initial: { seoSettings: SeoSettings; pageSeoRows: PageSeoRow[] };
};

export function AdminSeoClient({ initial }: Props) {
  const [globalSeo, setGlobalSeo] = useState(initial.seoSettings);
  const [pages, setPages] = useState(initial.pageSeoRows);
  const [selectedId, setSelectedId] = useState(initial.pageSeoRows[0]?.id ?? "");
  const selected = pages.find((page) => page.id === selectedId) ?? pages[0];

  const { feedback, message, isPending, execute } = useServerAction(
    async (payload: { global: SeoSettings; page: PageSeoRow | undefined }) => {
      const globalResult = await updateSeoSettings({
        siteTitle: payload.global.siteTitle,
        defaultDescription: payload.global.defaultDescription,
        ogImageLabel: payload.global.ogImageLabel,
        twitterHandle: payload.global.twitterHandle,
        robotsIndex: payload.global.robotsIndex,
        canonicalBase: payload.global.canonicalBase,
      });
      if (!globalResult.ok) return globalResult;

      // The selected page row is saved alongside the global defaults.
      if (payload.page) {
        return updatePageSeo(payload.page.id, {
          page: payload.page.page,
          path: payload.page.path,
          title: payload.page.title,
          description: payload.page.description,
        });
      }
      return globalResult;
    },
    { successMessage: "SEO settings saved.", errorPrefix: "Save failed:" },
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!globalSeo.siteTitle.trim()) return;
    execute({ global: globalSeo, page: selected });
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO"
        description="Global defaults and per-page metadata. Feeds the sitemap and page meta tags."
      />
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">Global SEO</h2>
          <div className="space-y-4">
            <Field label="Site title">
              <input
                className={inputClass}
                value={globalSeo.siteTitle}
                onChange={(event) =>
                  setGlobalSeo((c) => ({ ...c, siteTitle: event.target.value }))
                }
              />
            </Field>
            <Field label="Default description">
              <textarea
                className={textareaClass}
                value={globalSeo.defaultDescription}
                onChange={(event) =>
                  setGlobalSeo((c) => ({
                    ...c,
                    defaultDescription: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Canonical base URL">
              <input
                className={inputClass}
                value={globalSeo.canonicalBase}
                onChange={(event) =>
                  setGlobalSeo((c) => ({ ...c, canonicalBase: event.target.value }))
                }
              />
            </Field>
            <Field label="OG image">
              <input className={inputClass} value={globalSeo.ogImageLabel} readOnly />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={globalSeo.robotsIndex}
                onChange={(event) =>
                  setGlobalSeo((c) => ({ ...c, robotsIndex: event.target.checked }))
                }
              />
              Allow search indexing
            </label>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">Page SEO</h2>
          <AdminTable headers={["Page", "Path"]}>
            {pages.map((page) => (
              <tr
                key={page.id}
                className="cursor-pointer border-b border-[var(--line)] last:border-0 hover:bg-[#f7fbfc]"
                onClick={() => setSelectedId(page.id)}
              >
                <td className="px-4 py-3 font-medium">{page.page}</td>
                <td className="px-4 py-3 text-[var(--ink-muted)]">{page.path}</td>
              </tr>
            ))}
          </AdminTable>
          {selected ? (
            <div className="mt-4 space-y-4">
              <Field label={`Title · ${selected.page}`}>
                <input
                  className={inputClass}
                  value={selected.title}
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((page) =>
                        page.id === selected.id
                          ? { ...page, title: event.target.value }
                          : page,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Meta description">
                <textarea
                  className={textareaClass}
                  value={selected.description}
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((page) =>
                        page.id === selected.id
                          ? { ...page, description: event.target.value }
                          : page,
                      ),
                    )
                  }
                />
              </Field>
            </div>
          ) : null}
        </AdminCard>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save SEO settings"}
          </button>
          <FeedbackBanner feedback={feedback} message={message} />
        </div>
      </form>
    </div>
  );
}
