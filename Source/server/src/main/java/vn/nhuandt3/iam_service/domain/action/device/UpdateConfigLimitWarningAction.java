package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.device.ConfigLimitWarningParam;
import vn.nhuandt3.iam_service.domain.contract.device.ConfigLimitWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UpdateConfigLimitWarningAction {
    ConfigLimitWarningRepository configLimitWarningRepository;

    public ConfigLimitWarning handle(ConfigLimitWarningParam params) {
        ConfigLimitWarning config = params.toEntity();

        try {
            return configLimitWarningRepository.save(config);
        } catch (Exception exception) {
            throw new AppException("Cập nhật giới hạn thất bại!");
        }
    }
}
