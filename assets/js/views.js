document.addEventListener("DOMContentLoaded", async () => {
    const counters = [...document.querySelectorAll(".view-count")];

    if (!counters.length) {
        return;
    }

    const currentPath = window.location.pathname;

    const isSinglePost = currentPath.startsWith("/posts/");

    const setCount = (path, views) => {
        document
        .querySelectorAll(`.view-count[data-post="${CSS.escape(path)}"]`)
        .forEach((counter) => {
            counter.textContent = String(views);
        });
    };

    try {
        if (isSinglePost) {
            const response = await fetch("/api/views", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ path: currentPath })
            });

            if (!response.ok) {
                throw new Error(`View counter request failed: ${response.status}`);
            }

            const data = await response.json();
            setCount(data.path, data.views);
            return;
        }

        await Promise.all(
            counters.map(async (counter) => {
                const path = counter.dataset.post;

                if (!path) {
                    return;
                }

                const response = await fetch(
                    `/api/views?path=${encodeURIComponent(path)}`
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setCount(data.path, data.views);
            })
        );
    } catch (error) {
        console.warn("Unable to load view counts.", error);
    }
});
