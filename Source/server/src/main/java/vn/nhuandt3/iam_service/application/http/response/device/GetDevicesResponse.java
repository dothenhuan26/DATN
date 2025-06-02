package vn.nhuandt3.iam_service.application.http.response.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import vn.nhuandt3.iam_service.domain.entity.device.Device;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetDevicesResponse extends BaseResponse {
    Long id;
    String name;
    String type;
    String port;
    String createdAt;
    String updatedAt;

    public static List<GetDevicesResponse> format(List<Device> data) {
        List<GetDevicesResponse> response = new ArrayList<>();
        data.forEach(item -> {
            GetDevicesResponse device = new GetDevicesResponse();
            device.setId(item.getId());
            device.setName(item.getName());
            if (Objects.nonNull(item.getType())) {
                device.setType(item.getType().getId());
            }
            device.setPort(item.getPort());
            if (Objects.nonNull(item.getCreatedAt())) {
                device.setCreatedAt(item.getCreatedAt().format(formatter));
            }
            if (Objects.nonNull(item.getUpdatedAt())) {
                device.setUpdatedAt(item.getUpdatedAt().format(formatter));
            }
            response.add(device);
        });

        return response;
    }

}
