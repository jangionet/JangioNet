export async function onRequestGet({ env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  const redirectUri = "https://www.jangio.net/api/callback";

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  const githubUrl = new URL("https://github.com/login/oauth/authorize");

  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "repo");

  return Response.redirect(githubUrl.toString(), 302);
}
