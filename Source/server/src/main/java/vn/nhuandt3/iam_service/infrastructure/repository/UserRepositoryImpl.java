package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.user.UserRepository;
import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.UserJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.user.UserFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserRepositoryImpl implements UserRepository {
    UserJpaRepository userTable;

    @Override
    public List<User> getAll() {
        return userTable.findAll().stream().map(UserFactory::fromRaw).toList();
    }

    @Override
    public User getById(Long id) {
        if (Objects.isNull(id)) {
            return null;
        }

        UserEntity entity = userTable.findById(id).orElse(null);

        return !Objects.isNull(entity) ? UserFactory.fromRaw(entity) : null;
    }

    @Override
    public void deleteById(Long id) {
        if (Objects.isNull(id)) {
            return;
        }

        userTable.deleteById(id);
    }

    @Override
    public User save(User user) {
        UserEntity entity;

        if (Objects.isNull(user.getId())) {
            entity = UserFactory.toRaw(user);
        } else {
            entity = userTable.findById(user.getId()).orElse(null);

            if (Objects.isNull(entity)) {
                return null;
            }

            entity = UserFactory.toRawWithBeforeFields(user, entity);
        }

        return UserFactory.fromRaw(userTable.save(entity));
    }

    @Override
    public User getByUsername(String username) {
        if (Objects.isNull(username)) {
            return null;
        }

        UserEntity entity = userTable.findByUsername(username);

        return entity != null ? UserFactory.fromRaw(entity) : null;
    }

    @Override
    public User getByEmail(String email) {
        if (Objects.isNull(email)) {
            return null;
        }

        UserEntity entity = userTable.findByEmail(email);

        return entity != null ? UserFactory.fromRaw(entity) : null;
    }

    @Override
    public User getUserByIamId(String iamId) {
        if (Objects.isNull(iamId) || iamId.isBlank() || iamId.isEmpty()) {
            return null;
        }

        UserEntity entity = userTable.findByIamId(iamId);

        return !Objects.isNull(entity) ? UserFactory.fromRaw(entity) : null;
    }

    @Override
    public List<User> getUsers(Integer page, Integer limit) {
        if (Objects.isNull(page) || Objects.isNull(limit) || page < 1 || limit < 1) {
            return new ArrayList<>();
        }

        Integer offset = (page - 1) * limit;

        return userTable.getUsers(offset, limit).stream().map(UserFactory::fromRaw).toList();
    }

    @Override
    public User getByUsernameOrEmail(String username, String email) {
        if (Objects.isNull(email) || Objects.isNull(username)) {
            return null;
        }

        UserEntity entity = userTable.findByUsernameOrEmail(username, email);

        return entity != null ? UserFactory.fromRaw(entity) : null;
    }
}