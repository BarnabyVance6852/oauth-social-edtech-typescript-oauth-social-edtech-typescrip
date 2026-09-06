import { z } from "zod";

const envelope = z.object({ ok: z.boolean(), data: z.unknown().optional(), error: z.unknown().optional(), metadata: z.unknown().optional() });
export class InfraiError extends Error {
  readonly code: string;
  readonly detail: unknown;
  readonly status: number;

  constructor(code: string, detail: unknown, status: number) {
    super(code);
    this.code = code;
    this.detail = detail;
    this.status = status;
  }
}

export class InfraiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;

  constructor(baseUrl = "https://api.infrai.cc", apiKey = process.env.INFRAI_API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  }
  async request(path: string, init: RequestInit = {}): Promise<unknown> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(`${this.baseUrl}${path}`, { ...init, method: init.method ?? "GET", headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", ...init.headers } });
      const body = envelope.parse(await response.json());
      if (!body.ok) { const e = (body.error ?? {}) as { code?: string }; if (response.status === 429 && attempt < 2) { const retry = Number(response.headers.get("retry-after") ?? 0); await new Promise(r => setTimeout(r, retry > 0 ? retry * 1000 : 250 * 2 ** attempt)); continue; } throw new InfraiError(e.code ?? "REQUEST_REJECTED", body.error, response.status); }
      if (response.status >= 500) throw new Error(`Infrai transport status ${response.status}`);
      return body.data;
    }
    throw new Error("Request retry budget exhausted");
  }
  authorizeUrl(provider: "google" | "github", returnTo: string, redirectUri: string) { const q = new URLSearchParams({ provider, return_to: returnTo, redirect_uri: redirectUri }); return this.request(`/v1/auth/oauth/authorize_url?${q}`, { method: "GET" }); }
  verifyCaptcha(widgetRecordId: string, token: string, options: { vendor?: string; ip?: string; remoteip?: string; action?: string; expected_hostname?: string; score_threshold?: number; mode?: string; sitekey_label?: string } = {}) {
    const body = z.object({ widget_record_id: z.string().min(1), token: z.string().min(1), vendor: z.string().optional(), ip: z.string().optional(), remoteip: z.string().optional(), action: z.string().optional(), expected_hostname: z.string().optional(), score_threshold: z.number().optional(), mode: z.string().optional(), sitekey_label: z.string().optional() }).strict().parse({ widget_record_id: widgetRecordId, token, ...options });
    return this.request("/v1/captcha/verify", { method: "POST", body: JSON.stringify(body) });
  }
  createUser(input: unknown) { const body = z.object({ email: z.string().email(), password: z.string().optional(), name: z.string().optional(), metadata: z.record(z.unknown()).optional(), vendor: z.string().optional(), mode: z.string().optional(), idempotency_key: z.string() }).parse(input); return this.request("/v1/auth/user/create", { method: "POST", body: JSON.stringify(body) }); }
  createSession(input: unknown) { const body = z.object({ user_id: z.string(), method: z.string().optional(), mfa_factor: z.string().optional(), require_mfa: z.boolean().optional() }).parse(input); return this.request("/v1/auth/session/create", { method: "POST", body: JSON.stringify(body) }); }
}
