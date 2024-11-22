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


function isCorrectTimeInput(input) {
    input = input.replaceAll(' ', '')
    const splitted = input.split(':')
    if (input.search(/\d{2}:\d{2}/) !== -1 && splitted[0] < 24 && splitted[1] < 60 || input === '')
        return input
    return null
}

