package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.auth.IamScopeRepository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.IamScopeJpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IamScopeRepositoryImpl implements IamScopeRepository {
    IamScopeJpaRepository iamScopeTable;

    @Override
    public List<String> getScopesByUserId(Long userId) {
        if (Objects.isNull(userId)) {
            return new ArrayList<>();
        }

        return iamScopeTable.getScopesByUserId(userId);
    }
}
