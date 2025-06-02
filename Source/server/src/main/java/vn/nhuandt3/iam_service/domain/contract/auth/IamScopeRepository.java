package vn.nhuandt3.iam_service.domain.contract.auth;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface IamScopeRepository {
    List<String> getScopesByUserId(Long userId);
}
