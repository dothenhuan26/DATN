package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.auth.IamTokenRepository;
import vn.nhuandt3.iam_service.domain.entity.auth.IamToken;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.IamTokenEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.IamTokenJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.auth.IamTokenFactory;

import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IamTokenRepositoryImpl implements IamTokenRepository {
    IamTokenJpaRepository iamTokenTable;

    @Override
    public IamToken getByToken(String token) {
        if (Objects.isNull(token) || token.isEmpty()) {
            return null;
        }

        IamTokenEntity entity = iamTokenTable.findByToken(token);

        return entity != null ? IamTokenFactory.fromRaw(entity) : null;
    }

    @Override
    public IamToken save(IamToken iamToken) {
        if (Objects.isNull(iamToken)) {
            return null;
        }

        IamTokenEntity entity = IamTokenFactory.toRaw(iamToken);

        return IamTokenFactory.fromRaw(iamTokenTable.save(entity));
    }
}