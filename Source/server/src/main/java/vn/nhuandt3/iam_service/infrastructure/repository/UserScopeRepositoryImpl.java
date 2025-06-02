package vn.nhuandt3.iam_service.infrastructure.repository;

import vn.nhuandt3.iam_service.domain.contract.auth.UserScopeRepository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.UserScopeJpaRepository;

public class UserScopeRepositoryImpl implements UserScopeRepository {
    UserScopeJpaRepository userScopeTable;


}
