var mqtt = require("mqtt");
var mysql = require("mysql");
var moment = require("moment");
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const con = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 1000,
    charset: "utf8mb4",
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

var options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_AUTH_USERNAME,
    password: process.env.MQTT_AUTH_PASSWORD,
};

// initialize the MQTT client
var client = mqtt.connect(options);

// Tạo transporter email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'monface1999@gmail.com',
        pass: 'eolwppsxlmhrslsk'
    }
});

// Hàm đọc template HTML
function readTemplate(templateName) {
    return fs.readFileSync(path.join(__dirname, 'template', templateName), 'utf8');
}

// Hàm gửi email cảnh báo
async function sendWarningEmail(deviceType, value) {
    const template = deviceType === 'gas' ? 'gas-warning.html' : 'temperature-warning.html';
    const subject = deviceType === 'gas' ? 'Cảnh báo nồng độ khí gas vượt ngưỡng' : 'Cảnh báo nhiệt độ vượt ngưỡng';

    const mailOptions = {
        from: 'monface1999@gmail.com',
        to: 'dothenhuan26@gmail.com',
        subject: subject,
        html: readTemplate(template)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email cảnh báo đã được gửi thành công');
    } catch (error) {
        console.log('Lỗi gửi email:', error);
    }
}

// Hàm kiểm tra ngưỡng cảnh báo
async function checkWarningThreshold(deviceId, type, value) {
    return new Promise((resolve, reject) => {
        // Map type to device name
        const deviceType = type === 'gas' ? 'MQ2' : 'DHT11';
        const sql = "SELECT value FROM config_limit_warnings WHERE device_id = ? AND type = ?";
        con.query(sql, [deviceId, deviceType], (error, results) => {
            if (error) {
                console.log("Lỗi truy vấn database:", error);
                reject(error);
                return;
            }
            console.log("Ngưỡng cảnh báo cho thiết bị", deviceType, ":", results);
            if (results.length > 0 && value > results[0].value) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Hàm lưu cảnh báo vào database
async function logWarning(deviceId, type, value, unit) {
    const message = type === 'gas'
        ? `Cảnh báo nồng độ khí gas vượt ngưỡng: ${value} ppm`
        : `Cảnh báo nhiệt độ vượt ngưỡng: ${value}°C`;

    const sql = "INSERT INTO log_warnings (device_id, type, value, unit, message, created) VALUES (?, ?, ?, ?, ?, ?)";
    const created = moment().utcOffset("+07:00").format("YYYY-MM-DD HH:mm:ss");

    try {
        await con.query(sql, [deviceId, type, value, unit, message, created]);
        console.log('Đã lưu cảnh báo vào database');
    } catch (error) {
        console.log('Lỗi khi lưu cảnh báo:', error);
    }
}

// setup the callbacks
client.on("connect", function () {
    console.log("MQTT Connected");
});

client.on("error", function (error) {
    console.log(error);
});

client.on("message", async function (topic, message) {
    try {
        let log = {};

        // Gas MQ-2
        if (topic.includes("esp8266_data_gas_sensor") || topic.includes("esp8266_data_gas_sensor/")) {
            const data = JSON.parse(message.toString());
            const gasValue = Number(data['concentrations']);

            log = {
                device_id: 1,
                action: "read_gas",
                concentrations: gasValue,
                description: "...",
                created: moment().utcOffset("+07:00").format("YYYY-MM-DD HH:mm:ss"),
            };
            console.log("gas", log);

            // Kiểm tra ngưỡng cảnh báo
            const isOverThreshold = await checkWarningThreshold(1, 'gas', gasValue);
            console.log("Ngưỡng cảnh báo nồng độ khí Gas: ", isOverThreshold);
            if (isOverThreshold) {
                await sendWarningEmail('gas', gasValue);
                await logWarning(1, 'gas', gasValue, 'concentration');
            }

            // Ghi lịch sử nồng độ khí gas
            if (Object.keys(log).length) {
                try {
                    const sql =
                        "INSERT INTO gas_sensor_device_logs (device_id,action,concentrations,description,created) VALUES (?)";
                    await con.query(
                        sql,
                        [[log.device_id, log.action, log.concentrations, log.description, log.created]],
                        function (error, result) {
                            if (error) console.log(error);
                            else console.log("Log done!" + result.message.toString());
                        }
                    );
                } catch (e) {
                    console.log("Ghi lịch sử nồng độ khí gas thất bại:", e);
                }
            }
        }

        // DHT11
        if (
            topic.includes("esp8266_data_temperature_sensor") ||
            topic.includes("esp8266_data_temperature_sensor/")
        ) {
            const data = JSON.parse(message.toString());
            const temperature = Number(data['temperature']);

            log = {
                device_id: 2,
                action: "read_temp",
                temperature: temperature,
                humidity: Number(data['humidity']),
                description: "...",
                created: moment().utcOffset("+07:00").format("YYYY-MM-DD HH:mm:ss"),
            };
            console.log("temperature", log);

            // Kiểm tra ngưỡng cảnh báo
            const isOverThreshold = await checkWarningThreshold(2, 'temperature', temperature);
            console.log("Ngưỡng cảnh báo nhiệt độ: ", isOverThreshold);
            if (isOverThreshold) {
                await sendWarningEmail('temperature', temperature);
                await logWarning(2, 'temperature', temperature, 'celsius');
            }

            // Ghi lịch sử nhiệt độ, độ ẩm
            if (Object.keys(log).length) {
                try {
                    const sql =
                        "INSERT INTO temperature_sensor_device_logs (device_id,action,temperature,humidity,description,created) VALUES (?)";
                    await con.query(
                        sql,
                        [[log.device_id, log.action, log.temperature, log.humidity, log.description, log.created]],
                        function (error, result) {
                            if (error) console.log(error);
                            else console.log("Log done!" + result.message.toString());
                        }
                    );
                } catch (e) {
                    console.log("Ghi lịch sử nhiệt độ, độ ẩm thất bại: ", e);
                }
            }
        }
    } catch (e) {
        console.log("Handle message thất bại: " + e);
    }
});

// subscribe to topic 'my/test/topic'
client.subscribe("esp8266_data_gas_sensor");
client.subscribe("esp8266_data_temperature_sensor");