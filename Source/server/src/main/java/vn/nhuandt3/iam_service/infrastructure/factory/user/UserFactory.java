package vn.nhuandt3.iam_service.infrastructure.factory.user;

import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.domain.value_object.user.UserGroup;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserEntity;

import java.util.Objects;

public class UserFactory {
    public static User fromRaw(UserEntity entity) {
        User user = new User();
        user.setId(entity.getId());
        user.setUsername(entity.getUsername());
        user.setEmail(entity.getEmail());
        user.setFirstName(entity.getFirstName());
        user.setLastName(entity.getLastName());
        user.setBirthday(entity.getBirthday());
        user.setPassword(entity.getPassword());
        user.setPhone(entity.getPhone());
        user.setIamId(entity.getIamId());
        user.setGroup(UserGroup.tryFrom(entity.getGroupId()));
        return user;
    }

    public static UserEntity toRaw(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setFirstName(user.getFirstName());
        entity.setLastName(user.getLastName());
        entity.setPassword(user.getPassword());
        entity.setPhone(user.getPhone());
        entity.setBirthday(user.getBirthday());
        entity.setIamId(user.getIamId());
        entity.setGroupId(!Objects.isNull(user.getGroup()) ? user.getGroup().getId() : null);
        return entity;
    }

    public static UserEntity toRawWithBeforeFields(User after, UserEntity before) {
        UserEntity entity = new UserEntity();
        entity.setId(before.getId());
        entity.setEmail(before.getEmail());
        entity.setUsername(before.getUsername());
        entity.setIamId(before.getIamId());
        entity.setPassword(after.getPassword() != null ? after.getPassword() : before.getPassword());
        entity.setFirstName(after.getFirstName() != null ? after.getFirstName() : before.getFirstName());
        entity.setLastName(after.getLastName() != null ? after.getLastName() : before.getLastName());
        entity.setBirthday(after.getBirthday() != null ? after.getBirthday() : before.getBirthday());
        entity.setPhone(after.getPhone() != null ? after.getPhone() : before.getPhone());
        return entity;
    }
}