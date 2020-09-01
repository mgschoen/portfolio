function portfolioHeaderIntersectionCallback(entries) {
    entries.forEach((entry) => {
        entry.target.classList.toggle('sticky', entry.boundingClientRect.y < 0);
    });
}

function attachIntersectionObservers() {
    if (!'IntersectionObserver' in window) {
        return;
    }

    const observer = new IntersectionObserver(portfolioHeaderIntersectionCallback, {
        rootMargin: '-56px 0px 0px 0px'
    });
    const portfolioHeaders = document.querySelectorAll('.portfolio-header');
    portfolioHeaders.forEach(headerElement => {
        observer.observe(headerElement);
    });
}

attachIntersectionObservers();
