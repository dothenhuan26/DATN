#ifdef ESP8266
 #include <ESP8266WiFi.h>
 #else
 #include <WiFi.h>
#endif

#include "DHT.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#define DHTpin 5
#define DHTTYPE DHT11
DHT dht(DHTpin, DHTTYPE);

#define LED_PIN 4

/****** WiFi Connection Details *******/
const char* ssid = "Nha Tro Xanh T4";
const char* password = "99996666";

/******* MQTT Broker Connection Details *******/
const char* mqtt_server = "ecbb44930f454ccd863c43a1ce285a91.s1.eu.hivemq.cloud";
const char* mqtt_username = "smartHome1";
const char* mqtt_password = "deviceSmartHome1";
const int mqtt_port =8883;

/**** Secure WiFi Connectivity Initialisation *****/
WiFiClientSecure espClient;

/**** MQTT Client Initialisation Using WiFi Connection *****/
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

/****** root certificate *********/

static const char *root_ca PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
-----END CERTIFICATE-----
)EOF";

/************* Connect to WiFi ***********/
void setup_wifi() {
  delay(10);
  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("\nWiFi connected\nIP address: ");
  Serial.println(WiFi.localIP());
}

/************* Connect to MQTT Broker ***********/
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";   // Create a random client ID
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");

      client.subscribe("led_state");   // subscribe the topics here

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");   // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

/***** Call back Method for Receiving MQTT messages and Switching LED ****/

void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for (int i = 0; i < length; i++) incommingMessage+=(char)payload[i];

  Serial.println("Message arrived ["+String(topic)+"]"+incommingMessage);

 // --- check the incomming message
    if( strcmp(topic,"led_state") == 0){
     if (incommingMessage.equals("1")) digitalWrite(LED_PIN, HIGH);   // Turn the LED on
     else digitalWrite(LED_PIN, LOW);  // Turn the LED off
  }

}

/**** Method for Publishing MQTT Messages **********/
void publishMessage(const char* topic, String payload , boolean retained){
  if (client.publish(topic, payload.c_str(), true))
      Serial.println("Message publised ["+String(topic)+"]: "+payload);
}

/**** Application Initialisation Function******/
void setup() {

  dht.begin(); //Set up DHT11 sensor
  // pinMode(led, OUTPUT); //set up LED
  Serial.begin(9600);
  while (!Serial) delay(1);
  setup_wifi();

  #ifdef ESP8266
    espClient.setInsecure();
  #else
    espClient.setCACert(root_ca);      // enable this line and the the "certificate" code for secure connection
  #endif

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

/******** Main Function *************/
void loop() {

  if (!client.connected()) reconnect(); // check if client is connected
  client.loop();

  //read DHT11 temperature and humidity reading
  // delay(dht.getMinimumSamplingPeriod());
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  DynamicJsonDocument doc(1024);

  doc["device_id"] = "2";
  doc["device_name"] = "DHT11";
  doc["site_id"] = "smar-tHome";
  doc["humidity"] = humidity;
  doc["temperature"] = temperature;

  char mqtt_message[128];
  serializeJson(doc, mqtt_message);

  publishMessage("esp8266_data_temperature_sensor", mqtt_message, true);

  // gas sensor
  float mq2_measure = analogRead(A0);
    DynamicJsonDocument doc2(1024);

  doc2["device_id"] = "1";
  doc2["device_name"] = "MQ2";
  doc2["site_id"] = "smart-Home";
  doc2["concentrations"] = mq2_measure;

  char mqtt_message2[128];
  serializeJson(doc2, mqtt_message2);

  publishMessage("esp8266_data_gas_sensor", mqtt_message2, true);

  delay(2000);

}