const usbDetect = require('usb-detection')
const SerialPort = require('serialport')

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
            <td id="${port.comName}">Desconectado</td>
            <td>${port.comName}</td>
            <td>${getModelArduino(port.productId)}</td>
        </tr>`
    $('#devices-list').append(itemList)
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