# Dicestack server-status proxy

This repository includes a Netlify Function for the Launcher server browser.

## Deploy it

1. Create a new site in Netlify and import `dicestack88/dicestack88.github.io`.
2. Use the repository root as the base directory. Netlify reads the included `netlify.toml`.
3. Deploy the site. The function URL will be:
   `https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/server-status`
4. Copy that URL into `server-status-config.js` as `window.DICESTACK_SERVER_STATUS_ENDPOINT`.
5. Commit the configured endpoint and deploy the GitHub Pages site as usual.

The Netlify site is used as a server-side function host. GitHub Pages remains the public Launcher host.

## Endpoint

GET `/.netlify/functions/server-status?servers=eagler:arch.mc,java:mc.hypixel.net`

The function accepts only the server hostnames already listed in the function's allowlists. This prevents it being used as an arbitrary URL fetcher (SSRF proxy). It fetches upstream status on the server, normalizes the response, limits concurrency, and returns short-lived shared-cache headers.

- Eaglercraft: TopEaglerServers status API
- Java: MCSrvStat API

The function does not make upstream data authoritative. Counts remain provider-reported, and upstream failures are returned as unavailable. Netlify's CDN may cache successful function responses for 60 seconds; stale responses may be served for up to another 120 seconds where supported.

CORS permits the GitHub Pages origin. The function is public and therefore also applies a strict hostname allowlist and request-size limit. Add a custom domain/origin only if the Launcher domain changes.
