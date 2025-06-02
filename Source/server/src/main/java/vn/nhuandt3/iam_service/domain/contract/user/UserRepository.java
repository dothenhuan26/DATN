package vn.nhuandt3.iam_service.domain.contract.user;

import vn.nhuandt3.iam_service.domain.entity.user.User;

import java.util.List;

public interface UserRepository {
    List<User> getAll();

    User getById(Long id);

    void deleteById(Long id);

    User save(User user);

    User getByUsername(String username);

    User getByEmail(String email);

    User getUserByIamId(String iamId);

    List<User> getUsers(Integer page, Integer limit);

    User getByUsernameOrEmail(String username, String email);
}
