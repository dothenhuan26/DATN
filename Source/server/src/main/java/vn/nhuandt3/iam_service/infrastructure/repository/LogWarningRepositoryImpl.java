package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.device.SearchLogWarningParam;
import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.contract.device.LogWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.LogWarningEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.LogWarningJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.device.GasSensorDeviceLogFactory;
import vn.nhuandt3.iam_service.infrastructure.factory.device.LogWarningFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LogWarningRepositoryImpl implements LogWarningRepository {
    LogWarningJpaRepository logWarningTable;

    @Override
    public List<LogWarning> getLogs(SearchLogWarningParam params) {
        Long cursor = params.getCursor();
        Integer limit = params.getLimit();
        LocalDateTime from = params.getFrom();
        LocalDateTime to = params.getTo();
        OrderByType order = params.getOrder();
        String type = Objects.nonNull(params.getType()) ? params.getType().getId() : null;
        List<LogWarningEntity> entities = new ArrayList<>();

        if (Objects.isNull(limit)) {
            return new ArrayList<>();
        }

        if (Objects.isNull(cursor)) {
            cursor = 0L;
        }

        if (Objects.nonNull(order) && order.equals(OrderByType.DESC)) {
            if (cursor == 0) {
                cursor = null;
            }
            entities.addAll(logWarningTable.getLogsDesc(type, cursor, limit, from, to));
        } else {
            entities.addAll(logWarningTable.getLogs(type, cursor, limit, from, to));
        }

        return entities.stream().map(LogWarningFactory::fromRaw).toList();
    }

    @Override
    public List<LogWarning> getTopLogs(Integer limit) {
        if (Objects.isNull(limit)) {
            return new ArrayList<>();
        }

        return logWarningTable.getTopLogs(limit).stream().map(LogWarningFactory::fromRaw).toList();
    }
}
