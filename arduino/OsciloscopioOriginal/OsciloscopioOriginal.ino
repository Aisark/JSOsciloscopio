
void setup()
{
  Serial.begin(9600);
  analogReference(EXTERNAL);

  Inicializa();
}

void loop()
{
  Get_Instruccion();
}



int Get_Instruccion()
{
  if(Serial.available())
  {
      switch(Serial.read())
      {
         case 'r'://Leer entrada analogica y mandar dato
           Analog_Read();
         break; 
         
         case 's': //En espera a nueva inicializacion
           Salir();
         break;
      }
  }
}

void Salir()
{
  Inicializa(); //Loop en inicializa esperando nueva inicializacion
}

void Analog_Read()
{
    int resultado = 0;
    resultado = analogRead(0); //Leemos el pin analogico 0 en 10bits
    Serial.write(resultado / 4); //Mandamos el resultado en 8bits por Serial
}



//Inicializamos la comunicacion serial
//Debe mandar una secuencia de caracteres tal que cumplan con el criterio "square"
void Inicializa()
{
  int caracter[6];
  int i = 0;
  caracter[0] = 's';
  caracter[1] = 'q';
  caracter[2] = 'u';
  caracter[3] = 'a';
  caracter[4] = 'r';
  caracter[5] = 'e';
  while(1)
  {//Mientras no se inicialize no sale del ciclo
     if(Serial.available())
    {
        if(Serial.read() == caracter[i])
        {
          if(i == 5)
          {//Si es la ultima iteracion
            Serial.write('a');//escribimos caracter de confirmacion
            break; //Salimos del while
          }
          i++;
        }
      } 
  }
  /*
  115

113

117

97

114

101

13

*/
  //Termina While
}
