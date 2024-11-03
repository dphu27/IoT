#include <WiFi.h>          // Thư viện WiFi cho ESP32
#include <PubSubClient.h>   // Thư viện MQTT
#include <DHT.h>            // Thư viện cảm biến DHT

#define DHTPIN 5          // Chân GPIO5 cho cảm biến DHT11 (điều chỉnh nếu cần)
#define DHTTYPE DHT11      // Chọn loại cảm biến DHT11
DHT dht(DHTPIN, DHTTYPE);

int ldrPin = 34;          // Chân ADC1_6 (GPIO34) cho LDR trên ESP32 (điều chỉnh nếu cần)
int ldrValue = 0;         // Biến để lưu giá trị từ LDR

// Chân kết nối cho các thiết bị (điều chỉnh tùy theo phần cứng của bạn)
#define LIGHT1_PIN 13      // Chân GPIO13 cho Đèn
#define LIGHT2_PIN 14      // Chân GPIO14 cho Quạt
#define LIGHT3_PIN 26      // Chân GPIO26 cho Điều hòa

// bool ledState = LOW;  // Trạng thái hiện tại của đèn nhấp nháy
// bool manualControl = false;  // To track manual control of the light

// Thông tin Wi-Fi và MQTT
const char* ssid = "DPhu";
const char* password = "123456789";
const char* mqtt_server = "172.20.10.9";  // Địa chỉ IP của MQTT broker
const char* mqtt_username = "dinhphu";
const char* mqtt_password = "1234";

// Khởi tạo WiFi và MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Hàm kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Dang ket noi voi ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi đa ket noi");
  Serial.println("Dia chi IP: ");
  Serial.println(WiFi.localIP());
}

// Hàm xử lý tin nhắn MQTT nhận được
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Tin nhan nhan đuoc tren chu đe: ");
  Serial.print(topic);
  Serial.print(". Noi dung: ");
  Serial.println(message);

  // Điều khiển thiết bị dựa trên tin nhắn MQTT
  if (strcmp(topic, "home/devices/den") == 0) {
    if (message == "ON") {
      digitalWrite(LIGHT1_PIN, HIGH);
      client.publish("home/devices/den/status", "ON");
      Serial.println("Den đa bat");
    } else if (message == "OFF") {
      digitalWrite(LIGHT1_PIN, LOW);
      client.publish("home/devices/den/status", "OFF");
      Serial.println("Den da tat");
    }
  }
  if (strcmp(topic, "home/devices/quat") == 0) {
    if (message == "ON") {
      digitalWrite(LIGHT2_PIN, HIGH);
      client.publish("home/devices/quat/status", "ON");
      Serial.println("Quat da bat");
    } else if (message == "OFF") {
      digitalWrite(LIGHT2_PIN, LOW);
      client.publish("home/devices/quat/status", "OFF");
      Serial.println("Quat da tat");
    }
  }
  if (strcmp(topic, "home/devices/dieuhoa") == 0) {
    if (message == "ON") {
      digitalWrite(LIGHT3_PIN, HIGH);
      client.publish("home/devices/dieuhoa/status", "ON");
      Serial.println("Dieu hoa da bat");
    } else if (message == "OFF") {
      digitalWrite(LIGHT3_PIN, LOW);
      client.publish("home/devices/dieuhoa/status", "OFF");
      Serial.println("Dieu hoa da tat");
    }
  }
  if (strcmp(topic, "home/devices/all") == 0) {
    if (message == "ON") {
      digitalWrite(LIGHT1_PIN, HIGH);
      digitalWrite(LIGHT2_PIN, HIGH);
      digitalWrite(LIGHT3_PIN, HIGH);
      client.publish("home/devices/den/status", "ON");
      client.publish("home/devices/quat/status", "ON");
      client.publish("home/devices/dieuhoa/status", "ON");
      Serial.println("Tat ca cac thiet bi da bat");
    } else if (message == "OFF") {
      digitalWrite(LIGHT1_PIN, LOW);
      digitalWrite(LIGHT2_PIN, LOW);
      digitalWrite(LIGHT3_PIN, LOW);
      client.publish("home/devices/den/status", "OFF");
      client.publish("home/devices/quat/status", "OFF");
      client.publish("home/devices/dieuhoa/status", "OFF");
      Serial.println("Tat ca cac thiet bi da tat");
    }
  }
}

// Hàm kết nối lại với MQTT broker nếu mất kết nối
void reconnect() {
  while (!client.connected()) {
    Serial.print("Dang ket noi lai voi MQTT...");
    if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
      Serial.println("đa ket noi");

      // Đăng ký các chủ đề để điều khiển thiết bị
      client.subscribe("home/devices/den");
      client.subscribe("home/devices/quat");
      client.subscribe("home/devices/dieuhoa");
      client.subscribe("home/devices/all");
    } else {
      Serial.print("that bai, rc=");
      Serial.print(client.state());
      Serial.println(" thu lai sau 5 giay");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1983);
  client.setCallback(callback);

  // Khởi tạo cảm biến DHT
  dht.begin();

  // Đặt chế độ cho các chân điều khiển thiết bị
  pinMode(LIGHT1_PIN, OUTPUT);  // Đèn
  pinMode(LIGHT2_PIN, OUTPUT);  // Quạt
  pinMode(LIGHT3_PIN, OUTPUT);  // Điều hòa
}

void loop() {
  if (!client.connected()) {
    reconnect();  // Kết nối lại nếu cần
  }
  client.loop();  // Kiểm tra và xử lý các tin nhắn MQTT

  // Đọc dữ liệu cảm biến
  ldrValue = analogRead(ldrPin);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Kiểm tra nếu việc đọc cảm biến thất bại
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Khong doc duoc du lieu tu cam bien DHT!");
    return;
  }

  // if (!manualControl && ldrValue > 500) {
  //   ledState = !ledState;  // Chuyển đổi trạng thái LED nhấp nháy
  //   digitalWrite(LIGHT1_PIN, ledState);

  //   // Gửi trạng thái MQTT
  //   if (ledState) {
  //     client.publish("home/devices/den/status", "ON");
  //     Serial.println("LED nhấp nháy - Trạng thái: ON");
  //   } else {
  //     client.publish("home/devices/den/status", "OFF");
  //     Serial.println("LED nhấp nháy - Trạng thái: OFF");
  //   }
  //   delay(500); // Tốc độ nhấp nháy 500ms
  // } else if (!manualControl) {
  //   digitalWrite(LIGHT1_PIN, LOW);  // Tắt LED nếu ánh sáng < 500
  // }

  // Tạo payload JSON
  String payload = "{\"light\":";
  payload += String(ldrValue);
  payload += ",\"humidity\":";
  payload += String(humidity);
  payload += ",\"temperature\":";
  payload += String(temperature);
  payload += "}";

  // Gửi dữ liệu cảm biến đến MQTT
  client.publish("home/sensors", payload.c_str());
  Serial.print("Du lieu da gui: ");
  Serial.println(payload);

  // Độ trễ giữa các lần đọc dữ liệu
  delay(2000);
}
