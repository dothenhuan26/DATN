package vn.nhuandt3.iam_service.infrastructure.factory.auth;

import vn.nhuandt3.iam_service.domain.entity.auth.UserScope;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserScopeEntity;

public class UserScopeFactory {
    public static UserScope fromRaw(UserScopeEntity entity) {
        UserScope userScope = new UserScope();
        userScope.setId(entity.getId());
        userScope.setUserId(entity.getUserId());
        userScope.setScopeId(entity.getScopeId());
        return userScope;
    }

    public static UserScopeEntity toRaw(UserScope userScope) {
        UserScopeEntity entity = new UserScopeEntity();
        entity.setId(userScope.getId());
        entity.setUserId(userScope.getUserId());
        entity.setScopeId(userScope.getScopeId());
        return entity;
    }
}
