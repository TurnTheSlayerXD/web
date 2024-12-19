import {defineCustomElements} from "revogrid";

await defineCustomElements();
const grid = document.querySelector('revo-grid');


function getCellProps({prop, model, data, column}) {
    return {
        // Custom styles
        style: {
            color: model[prop] === 'Время' ? 'red' : 'black'
        },
        onClick: (event) => {
            console.log(`Cell clicked: ${model[prop]}`);
        },

    };
}


function getWeekDatesFromDate(date) {
    const dates = range(0, transformDateAsDigit(date) + 1)
        .map(n => subtractDaysFromDate(date, -n))
        .concat(range(1, 7 - transformDateAsDigit(date))
            .map(n => subtractDaysFromDate(date, n))).map(transformDateAsString)
    dates.sort()
    return dates
}

function getWeekDataFromStorage(date) {
    const requiredDates = getWeekDatesFromDate(date)
    localStorage.key(0)
    const n_keys = localStorage.getItem('n_keys');
    return range(0, n_keys)
        .map(localStorage.key)
        .filter(key => requiredDates.some(key.startsWith))
        .map(key => JSON.parse(localStorage.getItem(key)).flat());
}


const columns = [
    {prop: 'time', name: "Время", cellProperties: getCellProps, filter:},
    {prop: 0, name: "Monday"},
    {prop: 1, name: "tuesday"},
    {prop: 2, name: "wednesday"},
    {prop: 3, name: "thursday"},
    {prop: 4, name: "friday"},
    {prop: 5, name: "saturday"},
    {prop: 6, name: "sunday"}
];

function timeSortLambda(a, b) {
    

    if (a.time > b.time) {
        return 1
    } else if (a.time < b.time) {
        return -1
    } else {
        return a.date > b.date ? 1 : -1
    }
}


function createRowsFromData(data) {
    data.sort(timeSortLambda)

    return

}


// Here's your data, ready to be displayed
const rows = [{time: "10:00"}, {time: "11:00"}, {time: "11:00"}, {time: "11:00"}];

// Let the grid know about your columns and data
grid.autoSizeColumn = {
    mode: "autoSizeOnTextOverlap",
};


grid.columns = columns;
grid.source = rows;


grid.addEventListener('beforeedit', (event) => {
    const {detail} = event;
    console.log('Before edit:', detail);
});

grid.addEventListener('afteredit', (event) => {
    const {detail} = event;
    console.log('After edit:', detail);
});


