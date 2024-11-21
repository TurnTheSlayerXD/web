function getCrossAxisElems(inputCell) {

    const curTd = inputCell.parentNode.parentNode.parentNode
    const curLine = curTd.parentNode
    const targetTime = curLine.firstElementChild.querySelector("form > label > input")


    const index = [...curLine.children].findIndex((n) => n === curTd)
    const daysOfWeek = [...getElementByXpath('/html/body/main/table/thead/tr[2]').children]
    const targetDay = daysOfWeek[index]

    return [targetDay, targetTime]
}

function getWeekDatesFromDate(date) {
    const arr = range(0, transformDateAsDigit(date) + 1)
        .map(n => subtractDaysFromDate(date, -n))
        .concat(range(1, 7 - transformDateAsDigit(date))
            .map(n => subtractDaysFromDate(date, n))).map(transformDateAsString)
    arr.sort()
    return arr
}


function getWeekDataFromStorage(date) {
    const requiredDates = getWeekDatesFromDate(date)
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


function buildTableFromWeekData(data) {
    const table_header_node = createHeaderNode()
    const table_body_node = document.createElement('tbody')


    data.sort((a, b) => a.time === b.time ? a.date > b.date : a.time > b.time)

    for (const time of new Set(data.map(d => d.time))) {
        const table_row_node = createRowForTable(time)
        const l = data.findIndex(e => e.time === time)
        const r = data.findLastIndex(e => e.time === time) + 1


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
    getElementByXpath('/html/body/main').appendChild(table_node)

}

function createHeaderNode() {
    const table_header_node = document.createElement('thead')


    table_header_node.innerHTML =
        '        <tr>\n' +
        '            <th class=table_header>\n' +
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

    const el = table_header_node.querySelector("tr > th")
    const dateRange = getWeekDatesFromDate(new Date(sessionStorage.getItem('currentWeek')))
    const date_0 = dateRange[0]
    const date_n = dateRange[dateRange.length - 1]
    el.innerText = `Schedule from ${date_0} to ${date_n}`
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

function addEmptyLineToTable() {
    document.querySelector("body > main > table > tbody").appendChild(createRowForTable())
}


function addTimeEvent() {
    const elems = document.getElementsByClassName('time_input')


    for (const e of elems) {
        e.addEventListener('sortEvent', onSortEvent)
        e.addEventListener('change', (event) => {
            const time = isCorrectTimeInput(event.target.value)
            if (time) {
                event.target.value = time
                const sortEvent = new Event('sortEvent')
                event.target.dispatchEvent(sortEvent)
                updateStorage()
                addEmptyLineToTable()
                removeEnterPressDefaultBehaviour()
                addSelectedTaskEvent()
                addTimeEvent()
                addTaskChangeEvents()
            }

        })
    }

}


function removeEmptyLines() {
    const lines = document.querySelector("body > main > table > tbody").children

    for (const line in lines) {
        const time = getTimeFromLine(line)
        if (time !== '') {

        }
    }
}

function reorder() {
    const tbody = document.querySelector("body > main > table > tbody")
    const lines = [...document.querySelector("body > main > table > tbody").childNodes]
    lines.sort()
    console.log(lines)
    tbody.replaceChildren(...lines)
}

function onSortEvent(event) {
    // const time = event.target.value
    const targetLine = event.target.parentElement.parentElement.parentElement.parentElement

    reorder()

    // const tbody = targetLine.parentElement
    // const lines = [...tbody.children]
    // tbody.removeChild(targetLine)
    //
    //
    // const afterLine = lines.find(line => getTimeFromLine(line) > time)
    // if (afterLine === undefined)
    //     tbody.append(targetLine)
    // else
    //     afterLine.insertAdjacentElement('beforebegin', targetLine)
}


(function onWeekChange() {
    const el = getElementByXpath('/html/body/main/p/input')
    el.addEventListener('change', (event) => {
        const date = event.target.value
        const data = getWeekDataFromStorage(new Date(date))

        const prev = document.querySelector("body > main > table")
        if (prev) {
            prev.parentNode.removeChild(prev)
        }
        sessionStorage.setItem('currentWeek', JSON.stringify(date))
        buildTableFromWeekData(data)
        removeEnterPressDefaultBehaviour()
        addSelectedTaskEvent()
        addTimeEvent()
        addTaskChangeEvents()

    })
})();


function addTaskChangeEvents() {
    const tasks = document.getElementsByClassName('task_input')
    for (const task of tasks) {
        task.addEventListener('change', (event) => {
            console.log('Task change happened')
            updateStorage()
        })
    }
}


function getLineNodeFromTime(time) {
    const children = document.querySelector("body > main > table > tbody").children
    const i = [...children]
        .findIndex(t => t.querySelector("td:nth-child(1) > form > label > input").value === time)
    return [children[i], i]
}


function getDataFromTableInstance() {
    const tbody = document.querySelector("body > main > table > tbody")

    const dates = getWeekDatesFromDate(new Date(sessionStorage.getItem('currentWeek')))

    const data = []
    for (const line of [...tbody.children]) {

        const cells = [...line.children].slice(1,)
            .map(t => t.querySelector("form > label > input"))
        const [_, targetTime] = getCrossAxisElems(cells[0])

        for (let i = 0; i < 7; i += 1) {
            if (cells[i].value !== '') {
                const dt = {date: dates[i], time: targetTime.value, content: cells[i].value}
                data.push(dt)
            }
        }
    }

    return data
}

function updateStorage() {
    const date = new Date(sessionStorage.getItem('currentWeek'))
    const tableData = getDataFromTableInstance()

    const before = getWeekDataFromStorage(date)
    const groupedData = Object.groupBy(tableData, e => e.date)
    for (const key in groupedData) {
        localStorage.setItem(key, JSON.stringify(groupedData[key]))
    }
    const after = getWeekDataFromStorage(date)
    console.log(after)
}













