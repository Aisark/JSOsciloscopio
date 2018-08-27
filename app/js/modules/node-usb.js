const usbDetect = require('usb-detection')
const SerialPort = require('serialport')
const arduinoConect = require('./arduino-conect')

var modelArduino = {
    Uno_R3: '0043',
    Uno: '0001',
    Mega_ADK: '0044'
}

/**
 * @type Manejador de evento
 * 
 * @description Monitoriza los puertos para ver si un dispositivo nuevo
 * se conecta o desconecta
 */
usbDetect.startMonitoring();

/**
 * @type Manejador de evento
 * 
 * @description Este evento se dispara solamente cuando un dispositivo arduino
 * se conecta a un puerto y manda a llamar a la función `arduinoList`.
 */
usbDetect.on('add:9025', () => {
    arduinoList();
})

/**
 * @description Lista los dispositivos arduino que se encuentran conectados
 * al momento de iniciar la aplicación y manda a llamar a la función `arduinoList`.
 */
usbDetect.find(9025, () => {
    arduinoList();
})

/**
 * @type Manejador de evento
 * 
 * @description Este evento se dispara cuando un dispositivo arduino se desconecta
 * y manda a llamar a la función `arduinoList`.
 */
usbDetect.on('remove:9025', (device) => {
    arduinoList();
})

/**
 * @description Esta función se encarga de listar todo los dispositivos que estan
 * conectadas al ordenador, limpia el elemento html en donde se muestran estos dipositivos,
 * para mostrar los dispositivos en la interfaz se auxilia de la función `setItemList`.
 */
function arduinoList() {

    $('#devices-list').empty();

    SerialPort.list()
        .then((Port) => {
            Port.forEach(port => {
                if (port.serialNumber) {
                    setItemList(port);
                }
            });
        })
}

/**
 * @description Coloca la información de cada dispositivo conectado en una tabla de la interfaz
 * y coloca los eventos relacionados a ello del modulo `arduinoConect`.
 * 
 * @param {Port} port Un objeto de tipo Port de la libreria `SerialPort`, contiene información acerca
 * del dispositivo conectado
 */
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

/**
 * @description Detecta el modelo del arduino conectado y si esta en la lista de los modelos 
 * soportados en esta aplicación
 * 
 * @param {String} modelCode Modelo del arduino conectado
 */
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