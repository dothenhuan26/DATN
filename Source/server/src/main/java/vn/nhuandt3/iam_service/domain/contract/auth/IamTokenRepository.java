package vn.nhuandt3.iam_service.domain.contract.auth;

import vn.nhuandt3.iam_service.domain.entity.auth.IamToken;

public interface IamTokenRepository {
    IamToken getByToken(String token);

    IamToken save(IamToken iamToken);

}
