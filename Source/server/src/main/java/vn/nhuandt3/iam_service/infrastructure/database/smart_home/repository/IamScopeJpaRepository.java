package vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.IamScopeEntity;

import java.util.List;

@Repository
public interface IamScopeJpaRepository extends JpaRepository<IamScopeEntity, Long> {

    @Query(value = """
            	SELECT s.scope FROM IamScopeEntity as s
            	LEFT JOIN UserScopeEntity us ON (s.id = us.scopeId)
            	WHERE us.userId = :user_id
            """)
    List<String> getScopesByUserId(@Param("user_id") Long userId);


}
