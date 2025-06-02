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
@Table(name = "users_scopes")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserScopeEntity extends BaseEntity {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "scope_id")
    Long scopeId;
}
