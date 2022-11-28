#include <DallasTemperature.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <PubSubClient.h>
#include <ThingSpeak.h>
#include <WiFi.h>
#include <time.h>

// Data wire is plugged into digital pin 2 on the Arduino
#define ONE_WIRE_BUS 4
#define TdsSensorPin 35
#define VREF 3.3  // analog reference voltage(Volt) of the ADC
#define SCOUNT 30
#define SensorPin 32  // the pH meter Analog output is connected with the Arduino’s Analog

//////////// OM2M ///////////////////
#define CSE_IP "esw-onem2m.iiit.ac.in"
#define CSE_PORT 443
#define OM2M_ORGIN "t7AwqQ:uTUl5h"
#define OM2M_MN "/~/in-cse/in-name/"
#define OM2M_AE "Team-22"
#define OM2M_DATA_CONT "Node-1/Data"
#define INTERVAL 15000L

const char* ntpServer = "pool.ntp.org";

long randNumber;
long int prev_millis = 0;
unsigned long epochTime;

HTTPClient http;

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    // Serial.println("Failed to obtain time");
    return (0);
  }
  time(&now);
  return now;
}
//////////// OM2M ///////////////////

// Setup a oneWire instance to communicate with any OneWire device
OneWire oneWire(ONE_WIRE_BUS);

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

int analogBuffer[SCOUNT];  // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;
int turbidityPin = 33;

unsigned long int avgValue;  // Store the average value of the sensor feedback
float b;
int buf[10], temp;

float averageVoltage = 0;
float tdsValue = 0;
float temperature = 25;  // current temperature for

///////////////////

const char* ssid = "yeetusonthefetus";
const char* password = "ultraego";

const char* server = "mqtt3.thingspeak.com";
const char* mqttUserName = "Gxw8JTsYPRESMyQfGgsOIA4";
const char* mqttPass = "ZaREo0FkoM2jXWqOlLMo4Sre";
const char* clientID = "Gxw8JTsYPRESMyQfGgsOIA4";
long writeChannelID = 1904915;
const char* writeAPIKey = "GW7LM6SL201H6J41";

int port = 1883;

WiFiClient client;

PubSubClient mqttClient(client);

//////////////////

// median filtering algorithm
int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) {
    bTemp = bTab[(iFilterLen - 1) / 2];
  } else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}

void setup(void) {
  sensors.begin();  // Start up the library
  Serial.begin(9600);
  pinMode(TdsSensorPin, INPUT);
  pinMode(13, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    delay(3000);
  }
  Serial.println("WiFi Connected!");
  mqttClient.setServer(server, port);
  configTime(0, 0, ntpServer);  // OM2M //
}

void loop(void) {
  float total = 0;
  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U) {  // every 40 milliseconds,read the analog value from the ADC
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);  // read the analog value and store into the buffer
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT) {
      analogBufferIndex = 0;
    }
  }

  static unsigned long printTimepoint = millis();
  if (millis() - printTimepoint > 800U) {
    printTimepoint = millis();
    for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++) {
      analogBufferTemp[copyIndex] = analogBuffer[copyIndex];

      // read the analog value more stable by the median filtering algorithm, and convert to voltage value
      averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 4096.0;

      // temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
      float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
      // temperature compensation
      float compensationVoltage = averageVoltage / compensationCoefficient;

      // convert voltage value to tds value
      tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * 0.5;

      // Serial.print("voltage:");
      // Serial.print(averageVoltage,2);
      // Serial.print("V   ");
      total += tdsValue;
    }
  }
  float tds = total / SCOUNT;
  Serial.println(String() + "TDS VALUE: " + tds);

  /////////////////////////////////////////////////
  //// Temperature sensor
  // Send the command to get temperatures
  sensors.requestTemperatures();
  auto temperature = sensors.getTempCByIndex(0);

  // print the temperature in Celsius
  Serial.println(String() + "Temperature: " + String(temperature) + (char)176 + "C");
  // Serial.print((char)176);//shows degrees character

  ////////////////////////////////////////////////

  int sensorValue = analogRead(turbidityPin);
  // Serial.println("Raw sensor value: "+ String(sensorValue));
  // float temp = ((sensorValue*1.00)/1024)*5;
  float temp = sensorValue;
  float turbidity = map(sensorValue, 0, 550, 100, 0);
  // float turbidity = 1895 - 450*(temp);
  // float turbidity = -1120.4*(temp)*(temp) + 5742.3*(temp) - 4352.9;
  Serial.println(String() + "turbidity = " + String(turbidity));

  ////////////////////////////////////////////////////
  /////PH SENSOR
  float avgValue = analogRead(SensorPin);
  avgValue *= 5.0 / 1024;
  float phValue = 21.188 - 5.59701 * avgValue;

  Serial.println(String() + "PH : " + phValue);
  ////////////////////////////////////////////////////////
  /// Thingspeak part
  while (mqttClient.connected() == NULL) {
    Serial.println("Connecting to mqtt...");
    mqttClient.connect(clientID, mqttUserName, mqttPass);
    delay(1000);
  }
  mqttClient.loop();

  String dataString = "field1=" + String(tds) + "&field2=" + String(temperature) + "&field3=" + String(turbidity) + "&field4=" + String(phValue);
  String topicString = "channels/" + String(writeChannelID) + "/publish";
  mqttClient.publish(topicString.c_str(), dataString.c_str());

  Serial.println(String() + "Published: " + dataString);

  //////////// OM2M ///////////////////
  epochTime = getTime();
  String server = "https://" + String() + CSE_IP + ":" + String() + CSE_PORT + String() + OM2M_MN;

  http.begin(server + String() + OM2M_AE + "/" + OM2M_DATA_CONT + "/");

  http.addHeader("X-M2M-Origin", OM2M_ORGIN);
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");

  String data = "[" + String(epochTime) + ", " + String(tds) + ", " + String(temperature) + ", " + String(turbidity) + ", " + String(phValue) + "]";

  String req_data = String() + "{\"m2m:cin\": {" + "\"con\": \"" + data + "\"," + "\"lbl\": \"" + "V1.0.0" + "\","
                    //+ "\"rn\": \"" + "cin_"+String(i++) + "\","
                    + "\"cnf\": \"text\"" + "}}";
  /*
  json req_data sent to OM2M server:
  {
    "m2m:cin":
      {
        "con":"data",
        "lbl":"V1.0.0",
        // "rn":"cin_i",
        "cnf":"text"
      }
  }
  */
  int code = http.POST(req_data);
  http.end();
  Serial.println(String() + "OM2M server returns: " + code);

  //////////// OM2M ///////////////////

  // delay(2000);
  delay(5000);
}
