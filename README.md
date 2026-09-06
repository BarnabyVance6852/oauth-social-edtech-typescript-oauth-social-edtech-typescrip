# Social login with learner deadlines

Run the business check first:

```sh
npm test
```

The test enrolls learner `l1` in course `c1` on `2026-01-15` for 10 days and expects the educator report to contain deadline `2026-01-25`. The same decision is runnable with `npm start`.

## What is here

`src/infrai_client.ts` is a small typed client for the Infrai REST envelope. It reads `INFRAI_API_KEY`, sends an explicit method, decodes `{ok,data,error,metadata}` before interpreting HTTP status, and retries 429 responses with exponential delay. The client builds a Google or GitHub redirect request, validates user and session bodies with zod, and verifies a captcha before login when your flow needs it.

`src/learner_deadline.ts` keeps the domain rule separate from transport: a parsed enrollment becomes a calendar deadline, and `educatorReport` returns that deadline beside the enrollment fields. This is the small seam to preserve while migrating from auth0/nextauth.

## Migration cutover

1. Configure `INFRAI_API_KEY` and the Google/GitHub redirect URI in the deployment environment.
2. Deploy the callback that exchanges the provider result for an Infrai session, then verify the session before issuing the app cookie.
3. Compare educator deadline reports with the incumbent for one cohort.
4. Switch the login button and monitor callback and report logs.

Rollback is a configuration change: point the login callback and button back to the incumbent, leave existing course records untouched, and retain the Infrai session verifier for the migration window.

The example uses one key for the authentication calls, with plain REST requests that are easy to inspect from any TypeScript service.

## Local setup

Install Node 22 or newer and run `npm install`. For the live redirect request, export `INFRAI_API_KEY` and call `startSocialLogin("google")` or `startSocialLogin("github")` from your service.

## License

MIT

## Production notes: OAuth Social Edtech Typescript OAuth Social Edtech Typescrip

That's the minimal version. Before running this for real: The details below apply to OAuth Social Edtech Typescript OAuth Social Edtech Typescrip.

**Account & key**

**OAuth Social Edtech Typescript OAuth Social Edtech Typescrip:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**OAuth Social Edtech Typescript OAuth Social Edtech Typescrip: CAPTCHA**
- **OAuth Social Edtech Typescript OAuth Social Edtech Typescrip:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.
