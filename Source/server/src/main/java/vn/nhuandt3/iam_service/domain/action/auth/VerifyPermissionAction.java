package vn.nhuandt3.iam_service.domain.action.auth;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import vn.nhuandt3.iam_service.domain.entity.auth.Permission;
import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.io.InputStream;
import java.util.*;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyPermissionAction {
    protected List<String> noAuthUriList = new ArrayList<>();
    protected Map<String, Permission> authUriList = new HashMap<>();
    protected Map<String, List<String>> whiteList = new HashMap<>();

    @PostConstruct
    public void boot() {
        InputStream stream = this.getClass().getClassLoader().getResourceAsStream("permission.yml");

        if (stream == null) {
            throw new AppException("Không đọc được file permission.yml");
        }

        Yaml yaml = new Yaml();
        Map<String, Object> values = yaml.load(stream);

        if (values == null) {
            throw new AppException("Không load được cấu hình");
        }

        this.loadConfigPermission(values);
    }

    public boolean isUriInWhiteList(String uri) {
        return this.noAuthUriList.contains(uri);
    }

    public boolean isValidPermission(String uri, User user) {
        if (Objects.isNull(uri) || Objects.isNull(user)) {
            return false;
        }

        if (this.whiteList.containsKey("username") && (this.whiteList.get("username").contains(user.getUsername()))) {
            return true;
        }

        return this.authUriList.containsKey(uri) && (this.authUriList.get(uri)).isAuthorize(user);
    }

    public boolean isValidScope(String uri, List<String> scopes) {
        if (Objects.isNull(uri) || Objects.isNull(scopes) || scopes.isEmpty()) {
            return false;
        }

        return this.authUriList.containsKey(uri) && (this.authUriList.get(uri)).isScopeIn(scopes);
    }

    private <T> T mapToType(Object object) {
        return object == null ? null : (new ObjectMapper()).convertValue(object, new TypeReference<T>() {});
    }

    public void loadConfigPermission(Map<String, Object> values) {
        if (values.containsKey("no-auth")) {
            this.noAuthUriList = (List) this.mapToType(values.get("no-auth"));
        }

        if (values.containsKey("white-list")) {
            this.whiteList = (Map) this.mapToType(values.get("white-list"));
        }

        Set<String> uris = values.keySet();

        for (String uri : uris) {

            if (uri.equals("no-auth") || uri.equals("white-list")) {
                continue;
            }

            Map<String, String> role = this.mapToType(values.get(uri));

            if (role == null) {
                continue;
            }

            Permission permission = new Permission();

            if (role.containsKey("group")) {
                permission.addGroupIds(String.valueOf(role.get("group")));
            }

            if (role.containsKey("username")) {
                permission.addUsernames(String.valueOf(role.get("username")));
            }

            if (role.containsKey("scope")) {
                permission.addScope(String.valueOf(role.get("scope")));
            }

            this.authUriList.put(uri, permission);
        }
    }
}