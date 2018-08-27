var Chartist = require('../chartist.min.js')

var dataSeries = []
var chart;

// Variables para volts por division
var _high = 204;
var _low = -204;
var _divisor = 8;


var data = {
    // A labels array that can contain any sort of values
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

    series: [
        dataSeries
    ]

};

var options = {
    axisX: {
        showLabel: false,
    },

    axisY: {
        type: Chartist.FixedScaleAxis,
        showLabel: false,
        high: _high,
        low: _low,
        divisor: _divisor,
    },

    fullWidth: true,
    showPoint: false,
    showLine: false,
}

function updateDataSeries(newdata) {

    if (dataSeries.length > 10) {
        dataSeries.shift();
        options.showLine = true;
    }

    dataSeries.push(newdata /*- Math.floor((Math.random() * 255) + 1)*/ );

    chart.update(data, options);
}

function setDivision(newRange) {
    options.axisY.high = newRange
    options.axisY.low = (-1 * newRange)

    chart.update(data, options)
}

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
chart = new Chartist.Line('.ct-chart', data, options);

exports.Chart = {
    update: (newdata) => {
        updateDataSeries(newdata);
    },

    reset: () => {
        while (dataSeries.length > 0) {
            dataSeries.shift();
            chart.update()
        }
        options.showLine = false;
    },

    setVoltDiv: (newRange) => setDivision(newRange),

}