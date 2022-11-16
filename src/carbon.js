/**
 * gv-carbon
 * Forked from https://gitlab.com/wholegrain/website-carbon-badges
 * This version has no styling, just adds the text from the wholegrain carbon badge.
 */
{
    let carbon = document.querySelector('.gv-carbon'),
        site = encodeURIComponent(window.location.href);

    let newRequest = function (render = true) {
        // Run the API request because there is no cached result available
        fetch('https://api.websitecarbon.com/b?url=' + site)
            .then(function (r) {
                if (!r.ok) {
                    throw Error(r);
                }
                return r.json();
            })

            .then(function (r) {
                if (render) {
                    renderResult(r);
                }

                // Save the result into localStorage with a timestamp
                r.t = new Date().getTime();
                localStorage.setItem('gv-' + site, JSON.stringify(r));
            })

            // Handle error responses
            .catch(function (e) {
                carbon.innerHTML = 'This website runs on renewable energy';
                console.log(e);
                localStorage.removeItem('gv-' + site);
            });
    };

    const renderResult = function (r) {
        carbon.innerHTML =
            'This page produces ' +
            r.c +
            'g of CO<sub>2</sub>/view, cleaner than ' +
            r.p +
            '% of pages tested';
    };

    if ('fetch' in window) {
        // If the fetch API is not available, don't do anything.

        // Add the badge markup
        carbon.innerHTML = 'Measuring CO<sub>2</sub>&hellip;';

        // Get result if it's saved
        let cachedResponse = localStorage.getItem('gv-' + site);
        const t = new Date().getTime();

        // If there is a cached response, use it
        if (cachedResponse) {
            const r = JSON.parse(cachedResponse);
            renderResult(r);

            // If time since response was cached is over a day, then make a new request and update the cached result in the background
            if (t - r.t > 86400000) {
                newRequest(false);
            }

            // If no cached response, then fetch from API
        } else {
            newRequest();
        }
    }
}
