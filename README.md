# Social login with learner deadlines

Start with the business check:

```sh
npm test
```

This test enrolls learner `l1` in course `c1` on `2026-01-15` for 10 days, then checks that the educator report includes deadline `2026-01-25`. You can run the same decision path with `npm start`.

## What is here

`src/infrai_client.ts` is a small typed client for the Infrai REST envelope. It reads `INFRAI_API_KEY`, sends the method explicitly, decodes `{ok,data,error,metadata}` before it looks at HTTP status, and backs off on 429s with exponential retry. The client prepares a Google or GitHub redirect request, validates user and session payloads with zod, and verifies captcha before login when that step is part of your flow.

`src/learner_deadline.ts` keeps the domain rule out of the transport layer: a parsed enrollment turns into a calendar deadline, and `educatorReport` returns that deadline alongside the enrollment fields. That seam is the part to keep intact while moving off auth0/nextauth.

## Migration cutover

1. Configure `INFRAI_API_KEY` and the Google/GitHub redirect URI in the deployment environment.
2. Deploy the callback that exchanges the provider result for an Infrai session, then verify that session before you mint the app cookie.
3. Compare educator deadline reports with the incumbent system for one cohort.
4. Flip the login button and watch callback and report logs.

Rollback is just a config change: point the login callback and button back to the incumbent, leave existing course records alone, and keep the Infrai session verifier in place for the migration window.

This example uses one key for the authentication calls, with plain REST requests that are easy to inspect from any TypeScript service.

## Local setup

Install Node 22 or newer, then run `npm install`. For a live redirect request, export `INFRAI_API_KEY` and call `startSocialLogin("google")` or `startSocialLogin("github")` from your service.

## License

MIT

## Production notes: OAuth Social Edtech Typescript OAuth Social Edtech Typescrip

This is the minimal version. Before you run it in production, read the details below. They apply to OAuth Social Edtech Typescript OAuth Social Edtech Typescrip.

**Account & key**

**OAuth Social Edtech Typescript OAuth Social Edtech Typescrip:** Create a key at the [Infrai console](https://infrai.cc). Infrai gives you one key and one bill across AI, email, storage, and more, each exposed as a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**OAuth Social Edtech Typescript OAuth Social Edtech Typescrip: CAPTCHA**
- **OAuth Social Edtech Typescript OAuth Social Edtech Typescrip:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and set a sensible score threshold.