function range(startAt, endAt) {
    return [...Array(endAt - startAt).keys()].map(i => i + startAt);
}


function subtractDaysFromDate(date, n_days) {
    return new Date(date.getTime() + n_days * 24 * 3600 * 1000)
}

function transformDateAsString(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function transformDateAsDigit(date) {
    const i = date.getDay()
    if (i === 0)
        return 6
    return i - 1
}


function transformDayOfWeek(i) {
    let res = ''
    switch (i) {
        case 0 :
            res = 'Воскресенье';
            break
        case 1 :
            res = 'Понедельник';
            break
        case 2 :
            res = 'Вторник';
            break
        case 3 :
            res = 'Среда';
            break
        case 4 :
            res = 'Четверг';
            break
        case 5 :
            res = 'Пятница';
            break
        case 6 :
            res = 'Суббота';
            break
    }

    return res
}

function isCorrectTimeInput(input) {
    input = input.replaceAll(' ', '')
    const splitted = input.split(':')
    if (input.search(/\d{2}:\d{2}/) !== -1 && splitted[0] < 24 && splitted[1] < 60)
        return input
    return null
}


function rotateAroundIndex(arr, pos) {
    console.assert(pos < arr.length)
    arr.splice(0, arr.length, arr.slice(0, pos).concat(arr.slice(pos, arr.length)))
}

function getTimeFromLine(line) {
    return [...line.getElementsByClassName('time_input')][0].value
}