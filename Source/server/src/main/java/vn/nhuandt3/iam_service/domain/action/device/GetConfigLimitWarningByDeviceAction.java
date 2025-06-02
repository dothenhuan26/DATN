package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.ConfigLimitWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;

import java.util.ArrayList;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetConfigLimitWarningByDeviceAction {
    ConfigLimitWarningRepository configLimitWarningRepository;

    public ConfigLimitWarning handle(Long deviceId) {
        try {
            return configLimitWarningRepository.findByDeviceId(deviceId);
        } catch (Exception e) {
            return null;
        }
    }
}
