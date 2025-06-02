package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.TemperatureSensorDeviceLogEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TemperatureSensorDeviceLogJpaRepository extends JpaRepository<TemperatureSensorDeviceLogEntity, Long> {
    @Query(value = """
                SELECT l
                FROM TemperatureSensorDeviceLogEntity l
                WHERE (:cursor IS NULL OR l.id > :cursor)
                  AND (:from IS NULL OR l.created > :from)
                  AND (:to IS NULL OR l.created < :to)
                ORDER BY l.id ASC
                LIMIT :limit
            """)
    List<TemperatureSensorDeviceLogEntity> getLogs(Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);

    @Query(value = """
                SELECT l
                FROM TemperatureSensorDeviceLogEntity l
                WHERE (:cursor IS NULL OR l.id < :cursor)
                  AND (:from IS NULL OR l.created > :from)
                  AND (:to IS NULL OR l.created < :to)
                ORDER BY l.id DESC
                LIMIT :limit
            """)
    List<TemperatureSensorDeviceLogEntity> getLogsDesc(Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);


    @Query(value = """
                SELECT l
                FROM TemperatureSensorDeviceLogEntity l
                ORDER BY l.id DESC
                LIMIT :limit
            """)
    List<TemperatureSensorDeviceLogEntity> getTopLogs(Integer limit);
}
