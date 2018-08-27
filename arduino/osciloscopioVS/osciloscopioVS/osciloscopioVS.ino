/*
 Name:		osciloscopioVS.ino
 Created:	26/08/2018 16:53:08
 Author:	dark_
*/

// the setup function runs once when you press reset or power the board
void setup() {
	Serial.begin(9600);

	inicializador();
}

// the loop function runs over and over again until power down or reset
void loop() {
	startProgram();
}

void startProgram() {
	if (Serial.available())
	{
		switch (Serial.read())
		{
		case 'r'://Leer entrada analogica y mandar dato
			readAnalogInput();
			break;

		case 's': //En espera a nueva inicializacion
			inicializador();
			break;
		}
	}
}

void readAnalogInput()
{
	int resultado = 0;
	resultado = analogRead(A0); //Leemos el pin analogico 0 en 10bits
	Serial.print(resultado/4); //Mandamos el resultado en 8bits por Serial
}

void inicializador()
{
	int caracter[] = {
		's',
		'q',
		'u',
		'a',
		'r',
		'e'
	};
	int i = 0;

	while (true)
	{//Mientras no se inicialize no sale del ciclo
		if (Serial.available())
		{
			if (Serial.read() == caracter[i])
			{
				if (i == 5)
				{//Si es la ultima iteracion
					Serial.write('a');//escribimos caracter de confirmacion
					break; //Salimos del while
				}
				i++;
			}
		}
	}

}
