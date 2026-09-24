(function () {
    console.log('Sort script loaded');

    const select = document.getElementById('sort-posts');
    const feed = document.getElementById('post-feed');
    if (!select || !feed) {
        console.warn('Sort: missing #sort-posts or #post-feed', { select, feed });
        return;
    }

    console.log('Sort: elements found');

    function getCards() {
        return Array.from(feed.querySelectorAll('article.post-card'));
    }

    function sortCards(criteria) {
        const cards = getCards();
        const [key, dir] = criteria.split('-');

        cards.sort((a, b) => {
            let va, vb;

            if (key === 'date') {
                va = Date.parse(a.dataset.date || null);
                vb = Date.parse(b.dataset.date || null);
                if (Number.isNaN(va)) va = 0;
                if (Number.isNaN(vb)) vb = 0;
            } else if (key === 'title') {
                va = (a.dataset.title || '').toLowerCase();
                vb = (b.dataset.title || '').toLowerCase();
            } else if (key === 'views') {
                va = parseInt(a.dataset.views, 10) || 0;
                vb = parseInt(b.dataset.views, 10) || 0;
            } else {
                return 0;
            }

            if (va < vb) return dir === 'asc' ? -1 : 1;
            if (va > vb) return dir === 'asc' ? 1 : -1;
            return 0;
        });

        cards.forEach(c => feed.appendChild(c));
        console.log('Sort: applied', criteria, 'cards:', cards.length);
    }

    select.addEventListener('change', (e) => {
        console.log('Sort: changed to', e.target.value);
        sortCards(e.target.value);
    });

    // Optional: apply initial sort
    sortCards(select.value);
})();
