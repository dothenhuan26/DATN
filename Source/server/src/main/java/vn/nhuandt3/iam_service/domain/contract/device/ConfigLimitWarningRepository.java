package vn.nhuandt3.iam_service.domain.contract.device;

import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;

import java.util.List;

public interface ConfigLimitWarningRepository {
    ConfigLimitWarning findById(Long id);

    ConfigLimitWarning save(ConfigLimitWarning config);

    List<ConfigLimitWarning> findAll();

    ConfigLimitWarning findByDeviceId(Long id);
}
