function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Cache-Control": "no-store"
        }
    });
}

function normalizePath(value) {
    if (typeof value !== "string") {
        return null;
    }

    const path = value.trim();

    if (
        !path.startsWith("/posts/") ||
        path.includes("..") ||
        path.includes("?") ||
        path.includes("#")
    ) {
        return null;
    }

    return path.endsWith("/") ? path : `${path}/`;
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const path = normalizePath(url.searchParams.get("path"));

    if (!path) {
        return json(
            { error: "Use a valid post path, for example /posts/welcome/." },
            400
        );
    }

    const row = await context.env.DB
    .prepare("SELECT views FROM post_views WHERE path = ?")
    .bind(path)
    .first();

    return json({
        path,
        views: row?.views ?? 0
    });
}

export async function onRequestPost(context) {
    const body = await context.request.json().catch(() => null);
    const path = normalizePath(body?.path);

    if (!path) {
        return json(
            { error: "Use a valid post path, for example /posts/welcome/." },
            400
        );
    }

    await context.env.DB
    .prepare(`
    INSERT INTO post_views (path, views)
    VALUES (?, 1)
    ON CONFLICT(path)
    DO UPDATE SET views = views + 1
    `)
    .bind(path)
    .run();

    const row = await context.env.DB
    .prepare("SELECT views FROM post_views WHERE path = ?")
    .bind(path)
    .first();

    return json({
        path,
        views: row?.views ?? 0
    });
}
