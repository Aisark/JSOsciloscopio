const usbDetect = require('usb-detection')
const SerialPort = require('serialport')
const arduinoConect = require('./arduino-conect')

var modelArduino = {
    Uno_R3: '0043',
    Uno: '0001',
    Mega_ADK: '0044'
}

usbDetect.startMonitoring();


usbDetect.on('add:9025', () => {
    arduinoList();
})

usbDetect.find(9025, () => {
    arduinoList()
})

usbDetect.on('remove:9025', (device) => {
    arduinoList()
})


function arduinoList() {

    $('#devices-list').empty()

    SerialPort.list()
        .then((Port) => {
            Port.forEach(port => {
                if (port.serialNumber) {
                    setItemList(port)
                }
            });
        })
}

function setItemList(port) {

    var itemList =
        `<tr>
            <td id="${port.comName.replace('/dev/', '')}" class="comName">
                <button type="button" class="btn btn-outline-primary">conectar</button>
            </td>
            <td>${port.comName}</td>
        </tr>`
    $('#devices-list').append(itemList)
    arduinoConect.setEvent()
}

function getModelArduino(modelCode) {
    var model = ''
    for (var m in modelArduino) {
        if (modelArduino[m] === modelCode) {
            model = m;
            break;
        }
    }

    return model.replace('_', ' ')
}