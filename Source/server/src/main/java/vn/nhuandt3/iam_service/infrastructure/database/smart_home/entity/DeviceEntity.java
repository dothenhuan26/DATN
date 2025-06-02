package vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.infrastructure.database.core.entity.BaseEntity;

@Entity
@Table(name = "devices")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeviceEntity extends BaseEntity {
    @Column(name = "name")
    String name;

    @Column(name = "type")
    String type;

    @Column(name = "port")
    String port;
}
