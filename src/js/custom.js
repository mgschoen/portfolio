function portfolioHeaderIntersectionCallback(entries) {
    console.log(entries);
}

function attachIntersectionObservers() {
    if (!'IntersectionObserver' in window) {
        return;
    }

    const observer = new IntersectionObserver(portfolioHeaderIntersectionCallback, {
        rootMargin: '60px 0px 0px 0px'
    });
    const portfolioHeaders = document.querySelectorAll('.portfolio-header');
    portfolioHeaders.forEach(headerElement => {
        observer.observe(headerElement);
    });
}

attachIntersectionObservers();
