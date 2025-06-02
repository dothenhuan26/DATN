package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.contract.device.TemperatureSensorDeviceLogRepository;
import vn.nhuandt3.iam_service.domain.entity.device.TemperatureSensorDeviceLog;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.GasSensorDeviceLogEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.TemperatureSensorDeviceLogEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.TemperatureSensorDeviceLogJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.device.GasSensorDeviceLogFactory;
import vn.nhuandt3.iam_service.infrastructure.factory.device.TemperatureSensorDeviceLogFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TemperatureSensorDeviceLogRepositoryImpl implements TemperatureSensorDeviceLogRepository {
    TemperatureSensorDeviceLogJpaRepository temperatureSensorDeviceLogTable;

    @Override
    public List<TemperatureSensorDeviceLog> getLogs(SearchSensorParam params) {
        Long cursor = params.getCursor();
        Integer limit = params.getLimit();
        LocalDateTime from = params.getFrom();
        LocalDateTime to = params.getTo();
        OrderByType order = params.getOrder();
        List<TemperatureSensorDeviceLogEntity> entities = new ArrayList<>();

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
            entities.addAll(temperatureSensorDeviceLogTable.getLogsDesc(cursor, limit, from, to));
        } else {
            entities.addAll(temperatureSensorDeviceLogTable.getLogs(cursor, limit, from, to));
        }

        return entities.stream().map(TemperatureSensorDeviceLogFactory::fromRaw).toList();
    }

    @Override
    public List<TemperatureSensorDeviceLog> getTopLogs(Integer limit) {
        if (Objects.isNull(limit)) {
            return new ArrayList<>();
        }

        return temperatureSensorDeviceLogTable.getTopLogs(limit).stream().map(TemperatureSensorDeviceLogFactory::fromRaw).toList();
    }
}
