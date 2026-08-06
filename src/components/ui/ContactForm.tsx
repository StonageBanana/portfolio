"use client";

import { useState, type FormEvent } from "react";
import { contact, site } from "@/content";
import {
  submitContact,
  isFormConfigured,
  mailtoHref,
  type SubmitResult,
} from "@/lib/web3forms";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";
type Values = Record<"name" | "email" | "subject" | "message", string>;
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<SubmitResult | null>(null);
  const configured = isFormConfigured();

  function validate(field: keyof Values, value: string): string | undefined {
    if (!value.trim()) return contact.validation.required;
    if (field === "email" && !EMAIL_RE.test(value.trim()))
      return contact.validation.email;
    return undefined;
  }

  // Validation runs on blur, not on every keystroke.
  function handleBlur(field: keyof Values) {
    setErrors((e) => ({ ...e, [field]: validate(field, values[field]) }));
  }

  function handleChange(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: Errors = {};
    for (const f of Object.keys(values) as (keyof Values)[]) {
      const err = validate(f, values[f]);
      if (err) next[f] = err;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    const botcheck = new FormData(e.currentTarget).get("botcheck");
    const result = await submitContact({
      ...values,
      botcheck: typeof botcheck === "string" ? botcheck : "",
    });

    if (result.ok) {
      setStatus("success");
      setValues(EMPTY);
    } else {
      setFailure(result);
      setStatus("error");
    }
  }

  const errorCopy =
    failure && !failure.ok ? contact.errors[failure.reason] : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex h-full flex-col gap-6 rounded-[4px] border border-line bg-panel p-7 sm:p-9"
    >
      <h3 className="eyebrow">{contact.formTitle}</h3>

      {/* Honeypot — visually and semantically hidden from real users. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {contact.fields.map((f) => (
        <Field
          key={f.id}
          id={f.id}
          label={f.label}
          type={f.type}
          value={values[f.id]}
          error={errors[f.id]}
          onChange={(v) => handleChange(f.id, v)}
          onBlur={() => handleBlur(f.id)}
        />
      ))}

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          data-cursor="invert"
          data-magnetic
          className={cn(
            "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[4px] px-6 py-3",
            "font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300",
            status === "success"
              ? "bg-marker text-ink"
              : "bg-marker text-ink hover:bg-marker/90",
            status === "submitting" && "cursor-wait opacity-70",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
          />
          <span className="relative">
            {status === "success"
              ? contact.successLabel
              : status === "submitting"
                ? contact.submittingLabel
                : contact.submitLabel}
          </span>
          {status === "success" ? (
            <Icon name="Check" size={15} className="relative" />
          ) : (
            <Icon
              name="ArrowRight"
              size={15}
              className="relative transition-transform duration-300 group-hover:translate-x-0.5"
            />
          )}
        </button>

        {/* Permanent, not just an error branch — there is always a way through. */}
        <a
          href={mailtoHref(site.email)}
          data-cursor="invert"
          className="font-mono text-[11px] tracking-[0.12em] text-muted underline-offset-4 transition-colors duration-300 hover:text-marker hover:underline"
        >
          {contact.mailtoLabel}
        </a>
      </div>

      <p aria-live="polite" className="min-h-[1.25rem] text-xs">
        {status === "error" && errorCopy ? (
          <span className="text-signal">{errorCopy}</span>
        ) : status === "success" ? (
          <span className="text-marker">{contact.successLabel}.</span>
        ) : !configured ? (
          <span className="text-muted">{/* silent until submit */}</span>
        ) : null}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  value,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  type: "text" | "email" | "textarea";
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const filled = value.length > 0;
  const shared = cn(
    "peer w-full bg-transparent pt-6 pb-2 text-sm text-bone outline-none",
    "border-0 border-b border-line transition-colors duration-300",
    "focus:border-transparent",
  );

  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={shared}
        />
      )}

      {/* Floating label: rises and shifts to --marker on focus. */}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 origin-left transition-all duration-300",
          "font-mono text-[11px] tracking-[0.12em] uppercase",
          filled
            ? "top-0 text-[10px] text-muted"
            : "top-5 text-muted peer-focus:top-0 peer-focus:text-[10px]",
          "peer-focus:text-marker",
        )}
      >
        {label}
      </label>

      {/* Underline draws left to right on focus. */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-marker transition-transform duration-500 ease-out peer-focus:scale-x-100"
      />

      {error ? (
        <span
          id={`${id}-error`}
          className="mt-1.5 block font-mono text-[10px] tracking-[0.1em] text-signal"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
