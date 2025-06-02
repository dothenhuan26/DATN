package vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.infrastructure.database.core.entity.BaseSensorEntity;

@Entity
@Table(name = "temperature_sensor_device_logs")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemperatureSensorDeviceLogEntity extends BaseSensorEntity {
    @Column(name = "device_id")
    Long deviceId;

    @Column(name = "action")
    String action;

    @Column(name = "temperature")
    Float temperature;

    @Column(name = "humidity")
    Float humidity;

    @Column(name = "description")
    String description;
}
