package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.GasSensorDeviceLogEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GasSensorDeviceLogJpaRepository extends JpaRepository<GasSensorDeviceLogEntity, Long> {
    @Query(value = """
            SELECT l
            FROM GasSensorDeviceLogEntity l
            WHERE (:cursor IS NULL OR l.id > :cursor)
              AND (:from IS NULL OR l.created > :from)
              AND (:to IS NULL OR l.created < :to)
            ORDER BY l.id ASC
            LIMIT :limit
            """)
    List<GasSensorDeviceLogEntity> getLogs(Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);

    @Query(value = """
            SELECT l
            FROM GasSensorDeviceLogEntity l
            WHERE (:cursor IS NULL OR l.id < :cursor)
              AND (:from IS NULL OR l.created > :from)
              AND (:to IS NULL OR l.created < :to)
            ORDER BY l.id DESC
            LIMIT :limit
            """)
    List<GasSensorDeviceLogEntity> getLogsDesc(Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);

    @Query(value = """
                SELECT l
                FROM GasSensorDeviceLogEntity l
                ORDER BY l.id DESC
                LIMIT :limit
            """)
    List<GasSensorDeviceLogEntity> getTopLogs(Integer limit);
}
