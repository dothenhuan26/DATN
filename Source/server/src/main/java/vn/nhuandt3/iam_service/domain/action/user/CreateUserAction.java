package vn.nhuandt3.iam_service.domain.action.user;

import com.github.f4b6a3.ulid.UlidCreator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.user.CreateUserParam;
import vn.nhuandt3.iam_service.domain.contract.user.UserRepository;
import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.domain.value_object.user.UserGroup;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CreateUserAction {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    public User handle(CreateUserParam param) {
        User user = param.toEntity();

        User userExisted = userRepository.getByUsernameOrEmail(user.getUsername(), user.getEmail());

        if (!Objects.isNull(userExisted)) {
            throw new AppException("Tài khoản hoặc Email người dùng đã tồn tại!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setGroup(UserGroup.USER);
        user.setIamId(UlidCreator.getUlid().toString());

        try {
            return userRepository.save(user);
        } catch (Exception exception) {
            throw new AppException("Tạo tài khoản thất bại!");
        }
    }
}
