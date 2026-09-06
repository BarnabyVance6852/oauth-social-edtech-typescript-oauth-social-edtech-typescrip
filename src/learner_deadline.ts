import { InfraiClient } from "./infrai_client.ts";
import { z } from "zod";

export const enrollment = z.object({ learnerId: z.string().min(1), courseId: z.string().min(1), enrolledAt: z.coerce.date(), daysToComplete: z.number().int().positive() });
export function deadlineFor(input: unknown): string { const e = enrollment.parse(input); const d = new Date(e.enrolledAt); d.setUTCDate(d.getUTCDate() + e.daysToComplete); return d.toISOString().slice(0, 10); }
export async function startSocialLogin(provider: "google" | "github") {
  const returnTo = process.env.INFRAI_RETURN_TO;
  const redirectUri = process.env.INFRAI_OAUTH_REDIRECT_URI;
  if (!returnTo || !redirectUri) throw new Error("INFRAI_RETURN_TO and INFRAI_OAUTH_REDIRECT_URI are required");
  return new InfraiClient().authorizeUrl(provider, returnTo, redirectUri);
}
export async function educatorReport(rows: unknown[]) { return rows.map(row => ({ ...enrollment.parse(row), deadline: deadlineFor(row) })); }

if (import.meta.url === `file://${process.argv[1]}`) { const deadline = deadlineFor({ learnerId: "learner-7", courseId: "privacy-101", enrolledAt: "2026-09-01", daysToComplete: 14 }); console.log(JSON.stringify({ courseId: "privacy-101", deadline })); }
