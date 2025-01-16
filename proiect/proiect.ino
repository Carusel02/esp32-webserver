#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID  "Marius"
#define WIFI_PASSWORD "Mariusboss"

// Insert Firebase project API Key
#define API_KEY "AIzaSyD-u9e_fGVyBVg0kOPxA-PlItqLzEO-4xw"

// Insert RTDB URL
#define DATABASE_URL "https://esp32-2024-proiect-default-rtdb.europe-west1.firebasedatabase.app/"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long sendDataPrevMillis_alarm = 0;
bool signupOK = false;

// MQ135 Sensor Setup
#include <MQ135.h>
#define PIN_MQ135 32

float temperature = 21.0; // Assume current temperature. Recommended to measure with DHT22
float humidity = 35.0;    // Assume current humidity. Recommended to measure with DHT22

MQ135 mq135_sensor(PIN_MQ135, 4.80, 10.0);

// NTP Client setup
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000); // NTP server, UTC offset (0 for UTC), update interval (ms)

// LED setup
#define LED_PIN 14

// Buzzer setup
#define BUZZER_PIN 33

void setup() {
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Start NTP Client
  timeClient.begin();
  timeClient.update();

  // Firebase configuration
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Sign up
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase setup complete.");
    signupOK = true;
  } else {
    Serial.printf("Firebase setup error: %s\n", config.signer.signupError.message.c_str());
  }

  // Assign token status callback (addons/TokenHelper.h)
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void readAndSendSensorData() {
  
  // Get current time in milliseconds since Unix epoch
  unsigned long long timestamp = timeClient.getEpochTime() * 1000ULL;

  // Read data from the MQ135 sensor
  float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);

  // Create a JSON object to store the data
  FirebaseJson json;
  json.add("timestamp", timestamp);
  json.add("quality", correctedPPM);

  // Send data to Firebase
  if (Firebase.RTDB.pushJSON(&fbdo, "/airQuality", &json)) {
    Serial.println("Data sent to Firebase successfully!");
    Serial.println("PATH: " + fbdo.dataPath());
  } else {
    Serial.println("Failed to send data to Firebase.");
    Serial.println("Reason: " + fbdo.errorReason());
  }

  // Log sensor data
  Serial.print("Air Quality (PPM): ");
  Serial.println(correctedPPM);
  Serial.print("Timestamp: ");
  Serial.println(timestamp);
}


void readAlarmData() {
  if (Firebase.RTDB.getBool(&fbdo, "trigger")) {
    if (fbdo.dataType() == "boolean") {
      bool triggered = fbdo.boolData();
      // Serial.print("Triggered value: ");
      // Serial.println(triggered);
      if(triggered) {
          digitalWrite(BUZZER_PIN, LOW);
      } else {
          digitalWrite(BUZZER_PIN, HIGH);
      }
    }
  } else {
    Serial.println("Failed to get data from Firebase.");
    Serial.println("Reason: " + fbdo.errorReason());
  }
}

void loop() {

  // Send data every 60 seconds
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 60000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    readAndSendSensorData();
    digitalWrite(LED_PIN, HIGH);  // turn the LED on
    delay(1000);                 
    digitalWrite(LED_PIN, LOW);   // turn the LED off
  }

    // Send data every 60 seconds
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis_alarm > 1000 || sendDataPrevMillis_alarm == 0)) {
    sendDataPrevMillis_alarm = millis();
    readAlarmData();
  }

}
