const pathToTableBody = "body > main > table > tbody"
const pathToTable = "body > main > table"


function addGroupOfEvents(){

}



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
    addEmptyLineToTable(table_body_node)

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

function addEmptyLineToTable(tbody) {
    tbody.appendChild(createRowForTable())
}


function onTimeChangeEvent(event) {
    const time = isCorrectTimeInput(event.target.value)
    event.target.value = time
    if (time) {
        updateStorage()
        removeEnterPressDefaultBehaviour()
        addSelectedTaskEvent()
        addTaskChangeEvents()
    }
    const sortEvent = new Event('sortEvent')
    event.target.dispatchEvent(sortEvent)
    ifNoEmptyLineAddEmptyLine(document.querySelector(pathToTableBody))

    const path = `${pathToTableBody} > tr:nth-last-child(1)`
    const last = document.querySelector(path)

    const new_time = [...last.getElementsByClassName('time_input')][0]
    new_time.addEventListener('change', onTimeChangeEvent)
    new_time.addEventListener('sortEvent', onSortEvent)
    const tasks = [...last.getElementsByClassName('task_input')]
    for (const a of tasks) {
        a.addEventListener('change', onTaskChange)
    }

}


function addTimeChangeEvent() {
    const elems = document.getElementsByClassName('time_input')
    for (const e of elems) {
        e.addEventListener('sortEvent', onSortEvent)
        e.addEventListener('change', onTimeChangeEvent)
    }
}


function reorder() {
    const tbody = document.querySelector(pathToTableBody)
    const lines = [...tbody.children]

    lines.sort((a, b) => {
        const a_t = getTimeValueFromTr(a) !== '' ? getTimeValueFromTr(a) : '99:99'
        const b_t = getTimeValueFromTr(b) !== '' ? getTimeValueFromTr(b) : '99:99'
        if (a_t > b_t)
            return 1
        else if (a_t < b_t)
            return -1
        else
            return 0
    })
    tbody.replaceChildren(...lines)
}

function onSortEvent(event) {
    reorder()
}

function getTimeValueFromTr(tr) {
    return [...tr.getElementsByClassName('time_input')][0].value
}

function getTaskValuesFromTr(tr) {
    return [...tr.getElementsByClassName('task_input')].map(t => t.value)
}


function ifNoEmptyLineAddEmptyLine(tbody) {
    const last = tbody.lastChild
    console.log(last)
    if (!(getTaskValuesFromTr(last).every(t => t === '') && getTimeValueFromTr(last) === '')) {
        addEmptyLineToTable(tbody)
        console.log('Empty line adding')
    }
}


function onWeekChange(event) {
    const date = event.target.value
    const data = getWeekDataFromStorage(new Date(date))

    const prev = document.querySelector(pathToTable)
    if (prev) {
        prev.parentNode.removeChild(prev)
    }
    sessionStorage.setItem('currentWeek', JSON.stringify(date))
    buildTableFromWeekData(data)
    removeEnterPressDefaultBehaviour()
    addSelectedTaskEvent()
    addTimeChangeEvent()
    addTaskChangeEvents()
}


(function addWeekChange() {
    const el = getElementByXpath('/html/body/main/p/input')
    el.addEventListener('change', onWeekChange)
})();


function onTaskChange(event) {
    console.log('Task change happened')
    updateStorage()
    ifNoEmptyLineAddEmptyLine(document.querySelector(pathToTableBody))
}


function addTaskChangeEvents() {
    const tasks = document.getElementsByClassName('task_input')
    for (const task of tasks) {
        task.addEventListener('change', onTaskChange)
    }
}


function getDataFromTableInstance() {
    const tbody = document.querySelector(pathToTableBody)

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
}













