package vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.infrastructure.database.core.entity.BaseEntity;

import java.util.Date;

@Entity
@Table(name = "iam_tokens")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IamTokenEntity extends BaseEntity {
    @Column(name = "jwt_id", unique = true)
    String jwtId;

    @Column(name = "token", unique = true)
    String token;

    @Column(name = "expires_at")
    Date expiresAt;
}
