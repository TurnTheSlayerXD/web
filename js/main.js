
(function solveColorForMenuButtons() {

    const menuButtons = [...document.getElementsByClassName("header_menu_button")]

    const curPageButton = menuButtons.find((but) => document.URL.startsWith(but.children[0].href))

    if (curPageButton === undefined) {
        return
    }
    curPageButton.classList.remove('header_menu_button')
    curPageButton.classList.add('current_header_menu_button')

    for (const menuButton of menuButtons) {
        menuButton.addEventListener("mouseenter", (event) => {
                const eventBut = event.currentTarget
                eventBut.classList.remove('header_menu_button')
                eventBut.classList.add('selected_header_menu_button')
            }
        )
        menuButton.addEventListener("mouseleave", (event) => {
                const eventBut = event.currentTarget
                eventBut.classList.remove('selected_header_menu_button')
                eventBut.classList.add('header_menu_button')
            }
        )
    }
})();

(async function solveColorForAsideNews() {

    const newsBoxes = [...document.getElementsByClassName('aside_news_subelement')]

    if (newsBoxes.length > 0) {
        for (const b of newsBoxes) {
            b.addEventListener("mouseenter", (event) => {
                    const eventBut = event.currentTarget
                    eventBut.classList.remove('aside_news_subelement')
                    eventBut.classList.add('selected_aside_news_subelement')
                }
            )
            b.addEventListener("mouseleave", (event) => {
                    const eventBut = event.currentTarget
                    eventBut.classList.remove('selected_aside_news_subelement')
                    eventBut.classList.add('aside_news_subelement')

                }
            )
        }
    }
})();

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function addFooterIfNotExists() {
    const element = getElementByXpath('/html/body/footer')

    if (element == null) {
        const html = document.createElement('footer')
        html.className = 'bottom_license_footer'
        html.innerHTML = '<p><a href="#">Лицензионное соглашение</a><br/>Copyright © 2024. GalkovskyUniverse.com</p>'
        const body = getElementByXpath('/html/body')
        body.appendChild(html)
    }
}

(function timeAdder() {

        const observer = new PerformanceObserver(
            (observedEntries) => {
                const entry =
                    observedEntries.getEntriesByType('navigation')[0]
                if (entry.duration > 0) {
                    const msg = `Page load time in JavaScript<br>Page load time is ${entry.duration.toFixed(2)} ms`
                    const html = '<div>' + msg + '</div>'
                    addFooterIfNotExists()
                    const element = getElementByXpath('/html/body/footer')
                    const e = document.createElement('div')
                    e.innerHTML = html
                    element.appendChild(e)
                }
            })
        observer.observe({type: "navigation", buffered: true});
    }
)();
















