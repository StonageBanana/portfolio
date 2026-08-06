/**
 * Web3Forms submission.
 *
 * The access key is public by design — it is an alias for the destination
 * email, not a credential. That is the property that makes this the right
 * pick here: the site stays fully static with no route handler and no server
 * secret, so there is no code path that can fail the build when the key is
 * absent. It simply reports `unconfigured` and the permanent mailto link
 * carries the user through.
 */

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 8000;

/** Read lazily and defensively — never in a way that can throw at module scope. */
export function getAccessKey(): string | undefined {
  const k = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  return k && k.trim().length > 0 ? k.trim() : undefined;
}

export const isFormConfigured = () => Boolean(getAccessKey());

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — bots fill it, humans never see it. */
  botcheck?: string;
}

export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      reason: "unconfigured" | "network" | "timeout" | "rejected";
      message?: string;
    };

export async function submitContact(
  data: ContactPayload,
): Promise<SubmitResult> {
  const key = getAccessKey();
  if (!key) return { ok: false, reason: "unconfigured" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        access_key: key,
        subject: data.subject || `Portfolio enquiry — ${data.name}`,
        from_name: data.name,
        name: data.name,
        email: data.email,
        message: data.message,
        botcheck: data.botcheck ?? "",
      }),
    });

    const json = (await res.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!res.ok || !json?.success) {
      return { ok: false, reason: "rejected", message: json?.message };
    }
    return { ok: true };
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

/** Prefilled mailto — rendered permanently, not only as an error branch. */
export function mailtoHref(to: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  return `mailto:${to}${q ? `?${q}` : ""}`;
}
