(function genInitialTable() {

    const table_header_node = document.createElement('thead')
    table_header_node.innerHTML =
        '        <tr>\n' +
        '            <th class=table_header>\n' +
        '                Yearly Income Statements 2009 - 2012\n' +
        '            </th>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td>Время</td>\n' +
        '            <td>Понедельник</td>\n' +
        '            <td>Вторник</td>\n' +
        '            <td>Среда</td>\n' +
        '            <td>Четверг</td>\n' +
        '            <td>Пятница</td>\n' +
        '            <td>Суббота</td>\n' +
        '            <td>Воскресенье</td>\n' +
        '        </tr>\n'

    const table_body_node = document.createElement('tbody')


    for (const t of ['10:00', '11:00', '12:00', '13:00', '14:00']) {

        const table_row_node = document.createElement('tr')

        const table_column_node = document.createElement('td')
        table_column_node.innerHTML = '<form class="table_input_form" method="get" autocomplete="on">\n' +
            '                    <label>\n' +
            '                        <input class="time_input">\n' +
            '                    </label>\n' +
            '                </form>\n'
        table_column_node
            .getElementsByClassName('time_input')[0]
            .setAttribute('value', t)
        table_row_node.appendChild(table_column_node)

        for (let i = 0; i < 7; i += 1) {
            const table_column_node = document.createElement('td')
            table_column_node.innerHTML =
                '                <form class="table_input_form" method="get" autocomplete="on">\n' +
                '                    <label>\n' +
                '                        <input class="task_input" value="_"/>\n' +
                '                    </label>\n' +
                '                </form>\n'

            table_column_node.getElementsByClassName('task_input')[0].setAttribute('value',
                '_')
            table_row_node.appendChild(table_column_node)
        }
        table_body_node.appendChild(table_row_node)
    }

    const table_node = document.createElement("table")
    table_node.classList.add('schedule_table')
    table_node.appendChild(table_header_node)
    table_node.appendChild(table_body_node)

    getElementByXpath('/html/body/main').appendChild(table_node)

});


function getCrossAxisElems(elem) {

    const curTd = elem.parentNode.parentNode.parentNode
    const curLine = curTd.parentNode

    const targetTime = curLine.firstChild

    const index = [...curLine.children].findIndex((n) => n === curTd)
    const daysOfWeek = [...getElementByXpath('/html/body/main/table/thead/tr[2]').children]
    const targetDay = daysOfWeek[index]

    return [targetDay, targetTime]
}


function getWeekDataFromStorage(date) {
    console.log(date)
    const requiredDates = range(0, transformDateAsDigit(date) + 1)
        .map(n => subtractDaysFromDate(date, -n))
        .concat(range(1, 7 - transformDateAsDigit(date))
            .map(n => subtractDaysFromDate(date, n))).map(transformDateAsString)

    const storage = []
    for (const req of requiredDates) {
        const obj = localStorage.getItem(req)
        if (obj) {
            for (const e of JSON.parse(obj).flat()) {
                e.date = new Date(e.date)
                storage.push(e)
            }
        }
    }

    return storage
}


function getCellOnTimeAndDay(time, day_index) {

    const line = getElementByXpath('/html/body/main/table/tbody').children.find(
        e => e.querySelector('td:nth-child(1) > form > label > input').value === time)
    console.assert(line !== undefined)
    return line.children[day_index].querySelector('form > label > input')
}


function replaceCellValue(data) {
    const cell = getCellOnTimeAndDay(data.time,)
    cell.value = data.content
}


function buildTableFromWeekData(data) {
    const table_header_node = createHeaderNode()
    const table_body_node = document.createElement('tbody')


    data.sort((a, b) => a.time === b.time ? a.date > b.date : a.time > b.time)

    for (const time of new Set(data.map(d => d.time))) {
        const table_row_node = createRowForTable(time)
        const l = data.findIndex(e => e.time === time)
        const r = data.findLastIndex(e => e.time === time) + 1

        console.log(data)
        console.log(data.slice(l, r))

        for (const dt of data.slice(l, r)) {
            const day_index = transformDateAsDigit(dt.date)

            // day index + 1 because there is a time column
            const tg = table_row_node.children[day_index + 1].querySelector('form > label > input')
            tg.value = dt.content
        }
        table_body_node.appendChild(table_row_node)
    }

    table_body_node.appendChild(createRowForTable())


    const table_node = document.createElement("table")
    table_node.classList.add('schedule_table')
    table_node.appendChild(table_header_node)
    table_node.appendChild(table_body_node)

    console.log(table_node)

    getElementByXpath('/html/body/main').appendChild(table_node)

}

function createHeaderNode() {
    const table_header_node = document.createElement('thead')
    table_header_node.innerHTML =
        '        <tr>\n' +
        '            <th class=table_header>\n' +
        '                Yearly Income Statements 2009 - 2012\n' +
        '            </th>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td>Время</td>\n' +
        '            <td>Понедельник</td>\n' +
        '            <td>Вторник</td>\n' +
        '            <td>Среда</td>\n' +
        '            <td>Четверг</td>\n' +
        '            <td>Пятница</td>\n' +
        '            <td>Суббота</td>\n' +
        '            <td>Воскресенье</td>\n' +
        '        </tr>\n'
    return table_header_node
}


function createRowForTable(time = '') {

    const table_row_node = document.createElement('tr')
    const table_time_node = document.createElement('td')

    table_time_node.innerHTML = '<form class="table_input_form" method="get" autocomplete="on">\n' +
        '                    <label>\n' +
        '                        <input class="time_input">\n' +
        '                    </label>\n' +
        '                </form>\n'
    table_time_node
        .getElementsByClassName('time_input')[0]
        .setAttribute('value', time)

    table_row_node.appendChild(table_time_node)
    for (let i = 0; i < 7; i += 1) {
        const table_column_node = document.createElement('td')
        table_column_node.innerHTML =
            '                <form class="table_input_form" method="get" autocomplete="on">\n' +
            '                    <label>\n' +
            '                        <input class="task_input" value=""/>\n' +
            '                    </label>\n' +
            '                </form>\n'
        table_column_node.getElementsByClassName('task_input')[0].setAttribute('value',
            '')
        table_row_node.appendChild(table_column_node)
    }
    return table_row_node

}


function addTimeEvent() {
    const elems = document.getElementsByClassName('time_input')
    for (const e of elems) {
        e.addEventListener('change', (event) => {
            const time = isCorrectTimeInput(event.target.value)
            if (time) {
                event.target.value = time
                console.log(event.target)
            }

        })
    }

}


(function reactToWeekChange() {
    const el = getElementByXpath('/html/body/main/p/input')
    el.addEventListener('change', (event) => {
        const data = getWeekDataFromStorage(new Date(event.target.value))

        const prev = document.querySelector("body > main > table")
        if (prev) {
            prev.parentNode.removeChild(prev)
        }

        console.log(data)
        buildTableFromWeekData(data)
        removeEnterPressDefaultBehaviour()
        addSelectedTaskEvent()
        addTimeEvent()
    })
})();


(function makeInitialData() {
    let obj = {date: '2024-11-20', time: '10:00', content: 'nothing'}
    localStorage.setItem(obj.date, JSON.stringify([obj]))
    obj = {date: '2024-11-19', time: '10:00', content: 'nothing'}
    localStorage.setItem(obj.date, JSON.stringify([obj]))
    obj = {date: '2024-11-18', time: '10:00', content: 'nothing'}
    localStorage.setItem(obj.date, JSON.stringify([obj]))
    obj = {date: '2024-11-21', time: '10:00', content: 'nothing'}
    localStorage.setItem(obj.date, JSON.stringify([obj]))

})();


function getLineNodeFromTime(time) {
    const children = document.querySelector("body > main > table > tbody").children
    const i = [...children]
        .findIndex(t => t.querySelector("td:nth-child(1) > form > label > input").value === time)
    return [children[i], i]
}












