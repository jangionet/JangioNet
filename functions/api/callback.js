export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing GitHub OAuth code", { status: 400 });
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response("Missing GitHub OAuth configuration", {
      status: 500
    });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return new Response(
      `GitHub token exchange failed: ${tokenData.error || "unknown error"}`,
      { status: 500 }
    );
  }

  const message = {
    token: tokenData.access_token,
    provider: "github"
  };

  const safeMessage = JSON.stringify(message).replace(/</g, "\\u003c");

  return new Response(
    `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Authentication complete</title>
    </head>
    <body>
    <script>
    window.opener.postMessage(
      "authorization:github:success:${safeMessage}",
      window.location.origin
    );
    window.close();
    </script>
    Authentication complete. You may close this window.
    </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    }
  );
}
