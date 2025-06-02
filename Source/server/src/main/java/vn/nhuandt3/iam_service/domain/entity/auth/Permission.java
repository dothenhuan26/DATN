package vn.nhuandt3.iam_service.domain.entity.auth;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.entity.user.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class Permission {
    public static final Integer ALLOW_GROUP = -1;
    public static final String ALLOW_SCOPE = "all";
    public List<String> usernames = new ArrayList();
    public List<String> scopes = new ArrayList();
    public List<Integer> groupIds = new ArrayList();
    public List<Integer> positionJobIds = new ArrayList();

    public Permission() {
    }

    public void addUsernames(String usernames) {
        if (usernames != null && !usernames.isEmpty()) {
            this.usernames.addAll(List.of(usernames.split("[ ,]+")));
        }
    }

    public void addUsernames(List<String> usernames) {
        if (usernames != null && !usernames.isEmpty()) {
            this.usernames.addAll(usernames);
        }
    }

    public void addGroupIds(String strGroupIds) {
        if (strGroupIds != null && !strGroupIds.isEmpty()) {
            if (strGroupIds.contains("*")) {
                this.groupIds.add(ALLOW_GROUP);
            }

            strGroupIds = strGroupIds.replaceAll("[^0-9,]", "");
            if (!strGroupIds.isEmpty()) {
                this.groupIds.addAll(Stream.of(strGroupIds.split(",+")).map(Integer::parseInt).toList());
            }
        }
    }

    public void addPositionJobIds(String positionJobIds) {
        if (positionJobIds != null && !positionJobIds.isEmpty()) {
            this.positionJobIds.addAll(Stream.of(positionJobIds.split("[ ,]+")).map(Integer::parseInt).toList());
        }
    }

    public void addScope(String scopes) {
        if (scopes != null && !scopes.isEmpty()) {
            if (scopes.contains("*")) {
                this.scopes.add(ALLOW_SCOPE);
            }

            this.scopes.addAll(List.of(scopes.split("[ ,]+")));
        }
    }

    public boolean isScopeIn(List<String> scopes) {
        if (this.scopes.contains(ALLOW_SCOPE)) {
            return true;
        }

        if (Objects.isNull(scopes) || scopes.isEmpty()) {
            return false;
        }

        return scopes.stream().map(String::trim)
                .anyMatch(scope -> !scope.isEmpty() && this.scopes.contains(scope));
    }

    public boolean isAuthorize(User user) {
        if (user == null) {
            return false;
        }

        if (!this.usernames.isEmpty() && !user.getUsername().isEmpty() && this.usernames.contains(user.getUsername())) {
            return true;
        }

        return !this.groupIds.isEmpty() && !Objects.isNull(user.getGroup()) && (this.groupIds.contains(user.getGroup().getId()) || this.groupIds.contains(ALLOW_GROUP));
    }
}
