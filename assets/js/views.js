(function () {
    const isPostPage = document.querySelector('.article-page') !== null;
    if (!isPostPage) return;

    const pagePath = window.location.pathname;

    const WORKER_URL = 'https://site-views.jangio0.workers.dev';

    setTimeout(() => {
        const url = `${WORKER_URL}/track?page=${encodeURIComponent(pagePath)}`;
        fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});
    }, 30000);

    const counterEl = document.getElementById('view-count');
    if (counterEl) {
        fetch(`${WORKER_URL}/count?page=${encodeURIComponent(pagePath)}`)
        .then((r) => r.json())
        .then((data) => {
            counterEl.textContent = data.count;
        })
        .catch(() => {});
    }
})();
