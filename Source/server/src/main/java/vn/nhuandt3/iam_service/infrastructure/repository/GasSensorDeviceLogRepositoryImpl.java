package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.contract.device.GasSensorDeviceLogRepository;
import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.GasSensorDeviceLogEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.GasSensorDeviceLogJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.device.GasSensorDeviceLogFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GasSensorDeviceLogRepositoryImpl implements GasSensorDeviceLogRepository {
    GasSensorDeviceLogJpaRepository gasSensorDeviceLogTable;

    @Override
    public List<GasSensorDeviceLog> getLogs(SearchSensorParam params) {
        Long cursor = params.getCursor();
        Integer limit = params.getLimit();
        LocalDateTime from = params.getFrom();
        LocalDateTime to = params.getTo();
        OrderByType order = params.getOrder();
        List<GasSensorDeviceLogEntity> entities = new ArrayList<>();

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
            entities.addAll(gasSensorDeviceLogTable.getLogsDesc(cursor, limit, from, to));
        } else {
            entities.addAll(gasSensorDeviceLogTable.getLogs(cursor, limit, from, to));
        }

        return entities.stream().map(GasSensorDeviceLogFactory::fromRaw).toList();
    }

    @Override
    public List<GasSensorDeviceLog> getTopLogs(Integer limit) {
        if (Objects.isNull(limit)) {
            return new ArrayList<>();
        }

        return gasSensorDeviceLogTable.getTopLogs(limit).stream().map(GasSensorDeviceLogFactory::fromRaw).toList();
    }
}
