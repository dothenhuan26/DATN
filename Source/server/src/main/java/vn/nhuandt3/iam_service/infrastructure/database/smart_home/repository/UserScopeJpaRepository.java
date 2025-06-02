package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserScopeEntity;

@Repository
public interface UserScopeJpaRepository extends JpaRepository<UserScopeEntity, Long> {
}
