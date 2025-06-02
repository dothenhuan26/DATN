package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.LogWarningEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface LogWarningJpaRepository extends JpaRepository<LogWarningEntity, Long> {
    @Query(value = """
            SELECT l
            FROM LogWarningEntity l
            WHERE (:cursor IS NULL OR l.id > :cursor)
              AND (:from IS NULL OR l.created > :from)
              AND (:to IS NULL OR l.created < :to)
              AND (:type IS NULL OR l.type = :type)
            ORDER BY l.id ASC
            LIMIT :limit
            """)
    List<LogWarningEntity> getLogs(String type, Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);

    @Query(value = """
            SELECT l
            FROM LogWarningEntity l
            WHERE (:cursor IS NULL OR l.id < :cursor)
              AND (:from IS NULL OR l.created > :from)
              AND (:to IS NULL OR l.created < :to)
              AND (:type IS NULL OR l.type = :type)
            ORDER BY l.id DESC
            LIMIT :limit
            """)
    List<LogWarningEntity> getLogsDesc(String type, Long cursor, Integer limit, LocalDateTime from, LocalDateTime to);

    @Query(value = """
                SELECT l
                FROM LogWarningEntity l
                ORDER BY l.id DESC
                LIMIT :limit
            """)
    List<LogWarningEntity> getTopLogs(Integer limit);
}
