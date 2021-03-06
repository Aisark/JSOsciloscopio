const SerialPort = require('serialport');
const Chart = require('./grafico').Chart;

let _isConectArduino = false
let _arduino = null;
let _timer = null;
let _isReading = false;
let _configArduino = {
    baudRate: 9600
}

/**
 * @description Crea un objeto de la clase serialport con la ruta del puerto
 * del arduino conectado.
 * Inicializa los eventos relacionado con el objeto serialport
 * 
 * @param {string} comPort Ruta del puerto del arduino conectado
 */
function conectArduino(comPort) {
    let port = (comPort.includes('COM')) ? comPort : `/dev/${comPort}`

    $(`#${comPort}`).children()[0].textContent = 'Desconectar'

    _arduino = new SerialPort(port, _configArduino)

    arduinoWatch()
}

/**
 * @description Inicializa los eventos del objeto serialport si _arduino
 * no es null
 * 
 */
function arduinoWatch() {
    if (_arduino) {

        arduinoOnOpen(); // Esta pendiente si se conecta al arduino

        arduinoRead(); // Esta pendiente si hay algún dato en el stream

        arduinoOnClose();
    }
}

/**
 * @description Inicializa el evento onOpen del serialport conectado
 */
function arduinoOnOpen() {
    _arduino.on('open', function() {
        _isConectArduino = true;
    });
}

/**
 * @description Inicializa el evento de desconexión
 */
function arduinoOnClose() {
    _arduino.on('close', () => {
        _isConectArduino = false
        _isReadSend = false
    })
}

let _isReadSend = false
    /**
     * @description Inicializa el evento onData para ver 
     * si hay datos en el stream de entrada
     */
function arduinoRead() {
    _arduino.on('data', (data) => {

        if (!_isReadSend) {

            if (data.toString('utf8') == 'a') {
                _isReadSend = true
            }
        } else {
            let numero = parseInt(data.toString('utf8'), 10)
            Chart.update(numero)
        }
    })
}

/**
 * @description Envía un mensaje al arduino
 * @param {string} messaje El mensaje que se envíara al arduino
 */
function arduinoWrite(messaje) {
    if (_arduino) {
        _arduino.write(messaje);
        _arduino.drain((err) => {
            if (err) return console.log(err)
            if (messaje === 's') {
                arduinoClose()
            }
        })
    }
}

let globalCOMPort = '';

function arduinoClose() {
    _arduino.close(() => {
        $(`#${globalCOMPort}`).children()[0].textContent = 'Conectar'
        globalCOMPort = ''
    })
}

/**
 * @description Conecta o Desconecta el arduino
 */
function eventArduino() {
    $('.comName').on('click', (evt) => {
        if (!_isConectArduino) {
            conectArduinoAction(evt.currentTarget.id)
        } else {
            desconectArduinoAction(evt.currentTarget.id)
        }
    })
}

/**
 * @description Funcion para manejar el evento para conectar el arduino
 * @param {String} comPort Ruta del puerto del arduino conectado
 */
function conectArduinoAction(comPort) {
    conectArduino(comPort)
}

/**
 * @description Termina la conexión serial con el arduino
 * @param {string} comPort Ruta del puerto del arduino conectado
 */
function desconectArduinoAction(comPort) {
    globalCOMPort = comPort;
    arduinoWrite('s')
}


function readVoltArduino() {
    arduinoWrite('r');
}

$('#voltDiv').change(() => {
    var value = $('#voltDiv')[0].value
    var value = (value > 0) ? (value * 4) * 51 : ((1 / (-1 * value)) * 4) * 51;
    //console.log(value)
    Chart.setVoltDiv(value)
})

$('#sendMessage').on('click', () => {
    if (_isConectArduino) {
        if (!_isReadSend) {
            arduinoWrite('square');
        } else {
            if (!_isReading) {
                $('#sendMessage').addClass('disabled');
                _timer = setInterval(readVoltArduino, 100);
                $('#stopMessage').removeClass('disabled');
                _isReading = true;
            }
        }
    } else {
        console.log('Arduino desconectado')
    }
})

$('#stopMessage').on('click', () => {
    clearInterval(_timer);
    $('#stopMessage').addClass('disabled');
    $('#sendMessage').removeClass('disabled');
    Chart.reset();
    _isReading = false;
})

exports.setEvent = () => {
    eventArduino()
}

//