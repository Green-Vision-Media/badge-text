const wcID = (selector) => document.getElementById(selector);
const wcU = encodeURIComponent(window.location.href)

const newRequest = function (render = true) {
    // Run the API request because there is no cached result available
    fetch('https://api.websitecarbon.com/b?url=' + wcU)
        .then(function (r) {
            if (!r.ok) {
                throw Error(r);
            }
            return r.json();
        })

        .then(function (r) {
            if (render) {
                renderResult(r)
            }

            // Save the result into localStorage with a timestamp
            r.t = new Date().getTime()
            localStorage.setItem('gvm-bt_'+wcU, JSON.stringify(r))
        })

        // Handle error responses
        .catch(function (e) {
            wcID('gvm-bt_g').innerHTML = 'This website runs on renewable energy.';
            console.log(e);
            localStorage.removeItem('gvm-bt_'+wcU)
        })
}

const renderResult = function (r) {
    wcID('gvm-bt_g').innerHTML = 'This page produces ' + r.c + 'g of CO<sub>2</sub>/view | '
    wcID('gvm-bt_2').insertAdjacentHTML('beforeEnd', 'Cleaner than ' + r.p + '% of pages tested.')
}

// Target selector div
const wcB = wcID('gvm-bt');

// Get the HTML
const wcH = '<span id="gvm-bt_g" style="background-color:transparent;font-family:inherit;font-size:inherit; border-style:none;">Measuring CO<sub>2</sub>&hellip;</span><span id="gvm-bt_2" style="background-color:transparent;font-family:inherit;font-size:inherit; border-style:none;"></span>';

if (('fetch' in window)) { // If the fetch API is not available, don't do anything.

    // Add the badge markup
    wcB.insertAdjacentHTML('beforeEnd',wcH);

    // Get result if it's saved
    let cachedResponse = localStorage.getItem('gvm-bt_' + wcU)
    const t = new Date().getTime()

    // If there is a cached response, use it
    if (cachedResponse) {
        const r = JSON.parse(cachedResponse)
        renderResult(r)

        // If time since response was cached is over a day, then make a new request and update the cached result in the background
        if ((t - r.t) > (86400000)) {
            newRequest(false)
        }

    // If no cached response, then fetch from API
    } else {
        newRequest()
    }
}
