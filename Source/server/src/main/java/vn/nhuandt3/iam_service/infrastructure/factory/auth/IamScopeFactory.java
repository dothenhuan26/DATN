package vn.nhuandt3.iam_service.infrastructure.factory.auth;

import vn.nhuandt3.iam_service.domain.entity.auth.IamScope;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.IamScopeEntity;

public class IamScopeFactory {
    public static IamScope fromRaw(IamScopeEntity entity) {
        IamScope scope = new IamScope();
        scope.setId(entity.getId());
        scope.setScope(entity.getScope());
        return scope;
    }

    public static IamScopeEntity toRaw(IamScope scope) {
        IamScopeEntity entity = new IamScopeEntity();
        entity.setId(scope.getId());
        entity.setScope(scope.getScope());
        return entity;
    }
}
