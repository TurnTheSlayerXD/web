import {defineCustomElements} from "revogrid";

await defineCustomElements();


function getWeekDatesFromDate(date) {
    const numDayOfWeek = transformDateAsDigit(new Date(date))
    const dates = range(0, numDayOfWeek + 1)
        .map(n => subtractDaysFromDate(date, -n))
        .concat(range(1, 7 - numDayOfWeek)
            .map(n => subtractDaysFromDate(date, n))).map(transformDateAsString)
    dates.sort()
    return dates
}


function getWeekDataFromStorage(date) {
    const requiredDates = getWeekDatesFromDate(date);
    const n_keys = +localStorage.getItem('n_keys');

    const arr = range(0, n_keys + 1)
        .map(ind => localStorage.key(ind))
        .filter(key => key != null && requiredDates.some(d => key.startsWith(d)))
        .map(key => JSON.parse(localStorage.getItem(key)));
    return [arr, requiredDates]
}


function timeThenDateSortLambda(a, b) {
    if (a.time > b.time) {
        return 1
    } else if (a.time < b.time) {
        return -1
    } else {
        return a.date > b.date ? 1 : -1;
    }
}


function buildColumnsAndSources(data, dates) {
    const columns = [
        {
            prop: 'header', name: "Расписание",
            columnProperties: () => {
                return {
                    style: {
                        width:100,
                        color: 'red',
                    },
                    class: {
                        bank: true,
                    },
                }
            },

            children: [
                {
                    children: [{
                        prop: 'time',
                        name: "Время",
                        rowDrag: true,
                        sortable: true,
                        order: 'asc',
                        columnType: 'date',
                        cellCompare: (prop, a, b) => {
                            const av = a[prop] === undefined ? '99:99' : a[prop];
                            const bv = b[prop] === undefined ? '99:99' : b[prop];
                            return av > bv ? 1 : -1;
                        }
                    }]
                },
                {
                    prop: 'weekDays',
                    name: "Дни недели",
                    children: [{prop: dates[0], name: "Понедельник", autoSize: true},
                        {prop: dates[1], name: "Вторник", autoSize: true},
                        {prop: dates[2], name: "Среда", autoSize: true},
                        {prop: dates[3], name: "Четверг", autoSize: true},
                        {prop: dates[4], name: "Пятница", autoSize: true},
                        {prop: dates[5], name: "Суббота", autoSize: true},
                        {prop: dates[6], name: "Воскресенье", autoSize: true}]
                }
            ]
        }
    ];
    data.sort(timeThenDateSortLambda);
    const sources = [];
    for (const time of new Set(data.map(d => d.time))) {
        const l = data.findIndex(e => e.time === time)
        const r = data.findLastIndex(e => e.time === time) + 1
        const src = {};
        src['time'] = time
        for (const dt of data.slice(l, r)) {
            src[`${dt.date}`] = dt.content
        }
        sources.push(src);
    }
    return [columns, sources];
}


function generateUniqueKeyFromDate(date) {
    let i = 0
    while (localStorage.getItem(`${date}_${i}`) != null)
        ++i;
    return `${date}_${i}`
}

function saveDataInStorage(data) {
    localStorage.clear();
    for (const dt of data) {
        const key = generateUniqueKeyFromDate(dt.date);
        localStorage.setItem(key, JSON.stringify(dt));
    }
    localStorage.setItem("n_keys", data.length)
}

function grabDataFromTable() {
    const grid = document.querySelector("revo-grid")
    const {source} = grid;
    const data = [];
    for (const line of source) {
        for (const prop_date in line) {
            if (prop_date === 'time' || line[prop_date] === undefined || line[prop_date].trimEnd() === '')
                continue;
            if (line['time'] === undefined || line['time'].trimEnd() === '')
                continue;
            const dt = {date: prop_date, 'time': line['time'], content: line[prop_date]}
            data.push(dt)
        }
    }
    return data
}


function onWeekChange(event) {
    const date = event.target.value
    const [data, dates] = getWeekDataFromStorage(new Date(date))

    const grid = document.querySelector("revo-grid")
    sessionStorage.setItem('currentWeek', JSON.stringify(date))
    const [columns, sources] = buildColumnsAndSources(data, dates)

    sources.push({})
    grid.columns = columns
    grid.source = sources
    // ifNoEmptyLinesAddOne()
}

function ifNoEmptyLinesAddOne() {
    const grid = document.querySelector("revo-grid");
    const {source} = grid;
    console.log("length, ", source.length)
    if (source.length === 0 || Object.keys(source[source.length - 1]).length !== 0) {
        source.push({});
        grid.source = source;
        console.log(grid)
        console.log("after change", grid.source);
    }
}

(function main() {
    const grid = document.querySelector('revo-grid');
    grid.stretch = true;
    grid.autoSizeColumn = {
        mode: 'autoSizeOnTextOverlap'
    };
    grid.resize = true;
    grid.addEventListener('afteredit', (event) => {
        const {detail} = event
        if (detail.prop === 'time' && !isCorrectTimeInput(detail.val)) {
            detail.model.time = ''
        }
        const data = grabDataFromTable();
        saveDataInStorage(data)
        ifNoEmptyLinesAddOne()
    });


    if (localStorage.getItem("n_keys") == null) {
        localStorage.setItem("n_keys", 0);
    }

    const el = document.querySelector("#date_button")
    el.value = transformDateAsString(new Date());

    el.addEventListener('change', onWeekChange)
    el.dispatchEvent(new Event('change'));

})();




