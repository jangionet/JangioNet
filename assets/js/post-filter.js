document.addEventListener("DOMContentLoaded", () => {
    const feed = document.querySelector(".post-feed");
    const sortSelect = document.querySelector("#sort-posts");

    if (!feed || !sortSelect) {
        return;
    }

    const sortCards = () => {
        const cards = [...feed.querySelectorAll(".post-card")];

        cards.sort((a, b) => {
            const dateA = new Date(a.dataset.date || "1970-01-01");
            const dateB = new Date(b.dataset.date || "1970-01-01");

            const titleA = (a.dataset.title || "").toLowerCase();
            const titleB = (b.dataset.title || "").toLowerCase();

            const viewsA = Number(a.dataset.views || 0);
            const viewsB = Number(b.dataset.views || 0);

            switch (sortSelect.value) {
                case "date-asc":
                    return dateA - dateB;

                case "title-asc":
                    return titleA.localeCompare(titleB);

                case "title-desc":
                    return titleB.localeCompare(titleA);

                case "views-desc":
                    return viewsB - viewsA;

                case "date-desc":
                default:
                    return dateB - dateA;
            }
        });

        cards.forEach((card) => {
            feed.append(card);
        });
    };

    sortCards();
    sortSelect.addEventListener("change", sortCards);
    feed.addEventListener("posts:filtered", sortCards);
});
