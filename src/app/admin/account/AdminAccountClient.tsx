"use client";

import { FormEvent, useState } from "react";
import { FeedbackBanner, useServerAction } from "@/components/admin/AdminActions";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { roleLabels } from "@/lib/admin-config";
import { changeOwnPassword, updateOwnProfile } from "@/server/actions/account";

type Account = {
  name: string;
  email: string;
  role: string;
};

type Props = { initial: Account };

export function AdminAccountClient({ initial }: Props) {
  const [profile, setProfile] = useState<Account>(initial);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const profileSave = useServerAction(updateOwnProfile, {
    successMessage: "Profile updated.",
    errorPrefix: "Save failed:",
  });

  const passwordSave = useServerAction(changeOwnPassword, {
    successMessage: "Password changed. It applies the next time you sign in.",
    errorPrefix: "Change failed:",
    onSuccess: () => setPasswords({ current: "", next: "", confirm: "" }),
  });

  function onProfileSubmit(event: FormEvent) {
    event.preventDefault();
    profileSave.execute({ name: profile.name, email: profile.email });
  }

  function onPasswordSubmit(event: FormEvent) {
    event.preventDefault();
    passwordSave.execute(passwords);
  }

  return (
    <div>
      <AdminPageHeader
        title="Account / Profile"
        description="Your own admin profile and password."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">Profile</h2>
          <form onSubmit={onProfileSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={profile.name}
                onChange={(event) =>
                  setProfile((c) => ({ ...c, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile((c) => ({ ...c, email: event.target.value }))
                }
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={roleLabels[profile.role] ?? profile.role}
                readOnly
              />
            </Field>
            <button
              type="submit"
              disabled={profileSave.isPending}
              className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              {profileSave.isPending ? "Saving…" : "Save profile"}
            </button>
            <FeedbackBanner
              feedback={profileSave.feedback}
              message={profileSave.message}
            />
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand)]">Password</h2>
          <form onSubmit={onPasswordSubmit} className="space-y-4">
            <Field label="Current password">
              <input
                className={inputClass}
                type="password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((c) => ({ ...c, current: event.target.value }))
                }
              />
            </Field>
            <Field label="New password" hint="Minimum 8 characters.">
              <input
                className={inputClass}
                type="password"
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((c) => ({ ...c, next: event.target.value }))
                }
              />
            </Field>
            <Field label="Confirm new password">
              <input
                className={inputClass}
                type="password"
                value={passwords.confirm}
                onChange={(event) =>
                  setPasswords((c) => ({ ...c, confirm: event.target.value }))
                }
              />
            </Field>
            <button
              type="submit"
              disabled={passwordSave.isPending}
              className="rounded-full bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01458f] disabled:opacity-60"
            >
              {passwordSave.isPending ? "Updating…" : "Update password"}
            </button>
            <FeedbackBanner
              feedback={passwordSave.feedback}
              message={passwordSave.message}
            />
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
