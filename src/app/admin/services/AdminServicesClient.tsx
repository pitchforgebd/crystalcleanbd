"use client";

import { FormEvent, useState } from "react";
import {
  ConfirmDeleteButton,
  FeedbackBanner,
  useServerAction,
} from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  AdminTable,
  Field,
  StatusBadge,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import type { Service } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import { createService, deleteService, updateService } from "@/server/actions/services";

type ServiceDraft = Omit<Service, "id">;

const emptyDraft: ServiceDraft = {
  name: "",
  slug: "",
  category: "",
  icon: "spark",
  featuredImage: "",
  imageAlt: "",
  shortDescription: "",
  fullDescription: "",
  workScope: [],
  outcomes: [],
  features: [],
  availability: "",
  packageTags: [],
  rating: 0,
  reviewCount: 0,
  featured: false,
  popular: false,
  order: 1,
  active: true,
};

type Props = { initial: Service[] };

export function AdminServicesClient({ initial }: Props) {
  const [rows, setRows] = useState<Service[]>(initial);
  const [draft, setDraft] = useState<ServiceDraft>(emptyDraft);
  const [featuresText, setFeaturesText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function splitFeatures() {
    return featuresText.split("\n").map((l) => l.trim()).filter(Boolean);
  }

  const createAction = useServerAction(createService, {
    successMessage: "Service created.",
    errorPrefix: "Create failed:",
    onSuccess: (data) => {
      const created = data as { id: string; slug: string };
      setRows((current) => [...current, { ...draft, id: created.id }]);
      resetForm();
    },
  });

  const updateAction = useServerAction(
    (payload: { id: string; data: ServiceDraft }) =>
      updateService(payload.id, payload.data),
    {
      successMessage: "Service updated.",
      errorPrefix: "Update failed:",
      onSuccess: () => {
        if (editingId) {
          setRows((current) =>
            current.map((item) =>
              item.id === editingId
                ? { ...draft, id: editingId, features: splitFeatures() }
                : item,
            ),
          );
        }
        resetForm();
      },
    },
  );

  const deleteAction = useServerAction(deleteService, {
    successMessage: "Service deleted.",
    errorPrefix: "Delete failed:",
    onSuccess: (_, input) => {
      const id = (input as { id: string }).id;
      setRows((current) => current.filter((item) => item.id !== id));
    },
  });

  function resetForm() {
    setDraft(emptyDraft);
    setFeaturesText("");
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload: ServiceDraft = {
      ...draft,
      features: splitFeatures(),
    };
    if (editingId) {
      updateAction.execute({ id: editingId, data: payload });
    } else {
      createAction.execute(payload);
    }
  }

  function editRow(service: Service) {
    setEditingId(service.id);
    setDraft({
      name: service.name,
      slug: service.slug,
      category: service.category,
      icon: service.icon,
      featuredImage: service.featuredImage,
      imageAlt: service.imageAlt,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      workScope: service.workScope,
      outcomes: service.outcomes,
      features: service.features,
      availability: service.availability,
      packageTags: service.packageTags,
      rating: service.rating,
      reviewCount: service.reviewCount,
      featured: service.featured,
      popular: service.popular,
      order: service.order,
      active: service.active,
    });
    setFeaturesText(service.features.join("\n"));
  }

  const activeAction = editingId ? updateAction : createAction;

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Create and manage service catalog entries, ordering, and flags."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminTable headers={["Name", "Slug", "Order", "Flags", "Status", "Actions"]}>
          {rows.map((service) => (
            <tr key={service.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-medium">{service.name}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{service.slug}</td>
              <td className="px-4 py-3">{service.order}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {service.featured ? <StatusBadge active label="Featured" /> : null}
                  {service.popular ? <StatusBadge active label="Popular" /> : null}
                  {!service.featured && !service.popular ? (
                    <span className="text-xs text-[var(--ink-muted)]">—</span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={service.active} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--accent)]"
                    onClick={() => editRow(service)}
                  >
                    Edit
                  </button>
                  <ConfirmDeleteButton
                    disabled={activeAction.isPending}
                    onConfirm={() => deleteAction.execute({ id: service.id })}
                  />
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">
            {editingId ? "Edit service" : "Add service"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={draft.category}
                onChange={(event) => setDraft((c) => ({ ...c, category: event.target.value }))}
              />
            </Field>
            <Field label="Slug">
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => setDraft((c) => ({ ...c, slug: event.target.value }))}
              />
            </Field>
            <Field label="Order">
              <input
                className={inputClass}
                type="number"
                value={draft.order}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, order: Number(event.target.value) || 1 }))
                }
              />
            </Field>
            <Field label="Short description">
              <textarea
                className={textareaClass}
                value={draft.shortDescription}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, shortDescription: event.target.value }))
                }
              />
            </Field>
            <Field label="Full description">
              <textarea
                className={textareaClass}
                value={draft.fullDescription}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, fullDescription: event.target.value }))
                }
              />
            </Field>
            <ImageField
              label="Featured image"
              value={draft.featuredImage}
              onChange={(url) => setDraft((c) => ({ ...c, featuredImage: url }))}
            />
            <Field label="Image alt text">
              <input
                className={inputClass}
                value={draft.imageAlt}
                onChange={(event) =>
                  setDraft((c) => ({ ...c, imageAlt: event.target.value }))
                }
              />
            </Field>
            <Field label="Features" hint="One feature per line">
              <textarea
                className={textareaClass}
                value={featuresText}
                onChange={(event) => setFeaturesText(event.target.value)}
              />
            </Field>
            <div className="flex gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) =>
                    setDraft((c) => ({ ...c, featured: event.target.checked }))
                  }
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.popular}
                  onChange={(event) =>
                    setDraft((c) => ({ ...c, popular: event.target.checked }))
                  }
                />
                Popular
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(event) =>
                    setDraft((c) => ({ ...c, active: event.target.checked }))
                  }
                />
                Active (shown on the site)
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={activeAction.isPending}
                className="rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {activeAction.isPending
                  ? "Saving…"
                  : editingId
                    ? "Update service"
                    : "Create service"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-muted)]"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              ) : null}
            </div>
            <FeedbackBanner feedback={activeAction.feedback} message={activeAction.message} />
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
