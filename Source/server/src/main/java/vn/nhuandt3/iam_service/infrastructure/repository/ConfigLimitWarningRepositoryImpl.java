package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.ConfigLimitWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.ConfigLimitWarningEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.ConfigLimitWarningJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.device.ConfigLimitWarningFactory;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConfigLimitWarningRepositoryImpl implements ConfigLimitWarningRepository {
    ConfigLimitWarningJpaRepository configLimitWarningTable;

    @Override
    public ConfigLimitWarning findById(Long id) {
        if (Objects.isNull(id)) {
            return null;
        }

        return ConfigLimitWarningFactory.fromRaw(configLimitWarningTable.getById(id));
    }

    @Override
    public ConfigLimitWarning save(ConfigLimitWarning config) {
        ConfigLimitWarningEntity entity;

        if (Objects.isNull(config.getId())) {
            entity = ConfigLimitWarningFactory.toRaw(config);
        } else {
            entity = configLimitWarningTable.findById(config.getId()).orElse(null);

            if (Objects.isNull(entity)) {
                return null;
            }

            entity = ConfigLimitWarningFactory.toRawWithBeforeFields(config, entity);
        }

        return ConfigLimitWarningFactory.fromRaw(configLimitWarningTable.save(entity));
    }

    @Override
    public List<ConfigLimitWarning> findAll() {
        return configLimitWarningTable
                .findAll()
                .stream()
                .map(ConfigLimitWarningFactory::fromRaw)
                .toList();
    }

    @Override
    public ConfigLimitWarning findByDeviceId(Long id) {
        if (Objects.isNull(id)) {
            return null;
        }

        return ConfigLimitWarningFactory.fromRaw(configLimitWarningTable.findByDeviceId(id));
    }
}
