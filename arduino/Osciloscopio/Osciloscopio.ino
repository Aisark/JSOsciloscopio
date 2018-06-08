#include <SerialCommand.h>      // Steven Cogswell ArduinoSerialCommand library from http://GitHub.com
#include <SoftwareSerial.h>

#define ANALOG_READ 0


SerialCommand     serialCommand;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  analogReference(EXTERNAL);
  serialCommand.addCommand("r", ReadVolts );
}

void loop() {
  // put your main code here, to run repeatedly:
  serialCommand.readSerial();
}


void ReadVolts() {
  int value = 0;
  value = analogRead(ANALOG_READ);
  Serial.write(value / 4);
  Serial.println(value / 4);
}

