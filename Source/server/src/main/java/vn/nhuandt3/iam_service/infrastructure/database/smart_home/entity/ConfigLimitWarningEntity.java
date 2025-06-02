package vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.infrastructure.database.core.entity.BaseEntity;

@Entity
@Table(name = "config_limit_warnings")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfigLimitWarningEntity extends BaseEntity {
    @Column(name = "device_id")
    Long deviceId;

    @Column(name = "type")
    String type;

    @Column(name = "value")
    Float value;

    @Column(name = "unit")
    String unit;
}
