package vn.nhuandt3.iam_service.infrastructure.factory.auth;

import vn.nhuandt3.iam_service.domain.entity.auth.IamToken;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.IamTokenEntity;

public class IamTokenFactory {
    public static IamToken fromRaw(IamTokenEntity entity) {
        IamToken iamToken = new IamToken();
        iamToken.setId(entity.getId());
        iamToken.setJwtId(entity.getJwtId());
        iamToken.setToken(entity.getToken());
        iamToken.setExpiresAt(entity.getExpiresAt());
        return iamToken;
    }

    public static IamTokenEntity toRaw(IamToken iamToken) {
        IamTokenEntity entity = new IamTokenEntity();
        entity.setId(iamToken.getId());
        entity.setJwtId(iamToken.getJwtId());
        entity.setToken(iamToken.getToken());
        entity.setExpiresAt(iamToken.getExpiresAt());
        return entity;
    }
}