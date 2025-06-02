package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.ConfigLimitWarningEntity;

@Repository
public interface ConfigLimitWarningJpaRepository extends JpaRepository<ConfigLimitWarningEntity, Long> {
    ConfigLimitWarningEntity getById(Long id);

    @Query(value = """
            select e from ConfigLimitWarningEntity e
                    where e.deviceId = :deviceId
                    order by e.updatedAt limit 1
            """)
    ConfigLimitWarningEntity findByDeviceId(Long deviceId);
}
