
const path = require('path');
module.exports = {
    entry: './js/revogrid_schedule.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    }

}


