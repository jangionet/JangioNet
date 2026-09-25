document.addEventListener("DOMContentLoaded", () => {
    const feed = document.querySelector(".post-feed");

    if (!feed) {
        return;
    }

    const getSelectedCategory = () => (
        new URLSearchParams(window.location.search).get("category") || "all"
    )
    .trim()
    .toLowerCase();

    const filterPosts = () => {
        const selectedCategory = getSelectedCategory();
        const cards = [...feed.querySelectorAll(".post-card")];

        cards.forEach((card) => {
            const categories = (card.dataset.categories || "")
            .split(",")
            .map((category) => category.trim().toLowerCase())
            .filter(Boolean);

            card.hidden =
            selectedCategory !== "all" &&
            !categories.includes(selectedCategory);
        });

        document.querySelectorAll(".taxonomy-list a[data-category]").forEach((link) => {
            link.classList.toggle(
                "active-category",
                link.dataset.category === selectedCategory
            );
        });

        feed.querySelector(".category-empty-message")?.remove();

        const visibleCards = cards.filter((card) => !card.hidden);

        if (selectedCategory !== "all" && visibleCards.length === 0) {
            const message = document.createElement("p");
            message.className = "category-empty-message";
            message.textContent = `No posts in "${selectedCategory}" yet.`;
            feed.append(message);
        }

        feed.dispatchEvent(
            new CustomEvent("posts:filtered", {
                detail: { category: selectedCategory }
            })
        );
    };

    filterPosts();

    document.querySelectorAll(".taxonomy-list a[data-category]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const category = link.dataset.category || "all";
            const url = new URL(window.location.href);

            if (category === "all") {
                url.searchParams.delete("category");
            } else {
                url.searchParams.set("category", category);
            }

            window.history.pushState({}, "", url);
            filterPosts();
        });
    });

    window.addEventListener("popstate", filterPosts);
});
