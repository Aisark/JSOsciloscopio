var Chartist = require('../chartist.min.js')

var dataSeries = []
var chart;

var data = {
    // A labels array that can contain any sort of values
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

    series: [
        dataSeries
    ]

};

var options = {
    axisX: {
        showLabel: false,
    },

    axisY: {
        showLabel: false,
    },

    fullWidth: true,
    showPoint: false,
}

function updateDataSeries(newdata) {
    if (dataSeries.length > 10) dataSeries.shift();
    dataSeries.push(newdata - Math.floor((Math.random() * 10) + 1));

    chart.update();
}


// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
chart = new Chartist.Line('.ct-chart', data, options);

exports.chart = {
    update: (newdata) => {
        updateDataSeries(newdata);
    }
}