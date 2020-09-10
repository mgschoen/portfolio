function stickyHeadersIntersectionCallback(entries) {
    entries.forEach((entry) => {
        entry.target.classList.toggle('sticky', entry.boundingClientRect.y < 0);
    });
}

function initStickyHeaders() {
    if (!'IntersectionObserver' in window) {
        return;
    }

    const observer = new IntersectionObserver(stickyHeadersIntersectionCallback, {
        rootMargin: '-56px 0px 0px 0px'
    });
    const portfolioHeaders = document.querySelectorAll('.portfolio-header');
    portfolioHeaders.forEach(headerElement => {
        observer.observe(headerElement);
    });
}

export default initStickyHeaders;