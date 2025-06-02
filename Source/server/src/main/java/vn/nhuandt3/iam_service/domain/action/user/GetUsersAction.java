package vn.nhuandt3.iam_service.domain.action.user;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.user.UserRepository;
import vn.nhuandt3.iam_service.domain.entity.user.User;

import java.util.List;
import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetUsersAction {
    UserRepository userRepository;

    @NonFinal
    @Value("${common.list.paginate.limit}")
    protected Integer LIMIT;
    @NonFinal
    @Value("${common.list.paginate.page.start}")
    protected Integer START;

    public List<User> handle(Integer page, Integer limit) {
        if (Objects.isNull(page) || page < 1) {
            page = START;
        }

        if (Objects.isNull(limit) || limit < 1) {
            limit = LIMIT;
        }

        return userRepository.getUsers(page, limit);
    }
}
