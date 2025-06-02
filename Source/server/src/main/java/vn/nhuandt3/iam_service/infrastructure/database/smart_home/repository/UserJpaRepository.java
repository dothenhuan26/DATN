package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserEntity;

import java.util.List;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsername(String username);

    UserEntity findByEmail(String email);

    UserEntity findByIamId(String iamId);

    @Query(value = """
                SELECT u 
                FROM UserEntity u 
                WHERE u.username = :username
                OR u.email = :email
            """)
    UserEntity findByUsernameOrEmail(String username, String email);

    @Query(value = """
                SELECT u 
                FROM UserEntity u
                ORDER BY u.id ASC
                LIMIT :limit
                OFFSET :offset
            """)
    List<UserEntity> getUsers(Integer offset, Integer limit);
}
