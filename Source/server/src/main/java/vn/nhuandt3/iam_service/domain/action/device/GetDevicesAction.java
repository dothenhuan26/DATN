package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.DeviceRepository;
import vn.nhuandt3.iam_service.domain.entity.device.Device;

import java.util.ArrayList;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetDevicesAction {
    DeviceRepository deviceRepository;

    public List<Device> handle() {
        try {
            return deviceRepository.findAll();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
