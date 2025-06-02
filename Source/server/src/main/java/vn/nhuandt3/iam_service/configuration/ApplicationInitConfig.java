package vn.nhuandt3.iam_service.configuration;

import com.github.f4b6a3.ulid.UlidCreator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.nhuandt3.iam_service.domain.value_object.device.ActionType;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;
import vn.nhuandt3.iam_service.domain.value_object.user.UserGroup;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.*;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    protected int strength = 10;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(strength);
    }

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driver-class-name",
            havingValue = "com.mysql.cj.jdbc.Driver"
    )
    ApplicationRunner applicationRunner(
            IamTokenJpaRepository iamTokenTable,
            IamScopeJpaRepository iamScopeTable,
            UserScopeJpaRepository userScopeTable,
            UserJpaRepository userTable,
            DeviceJpaRepository deviceTable,
            ConfigLimitWarningJpaRepository configLimitWarningTable,
            GasSensorDeviceLogJpaRepository gasSensorDeviceLogTable,
            TemperatureSensorDeviceLogJpaRepository temperatureSensorDeviceLogTable,
            LogWarningJpaRepository logWarningTable
    ) {
        return args -> {
            log.info("Application starting...");

            if (deviceTable.count() == 0) {
                // Fake devices
                List<DeviceEntity> devices = new ArrayList<>();

                DeviceEntity mq2 = new DeviceEntity();
                mq2.setName("Cảm biến khí Gas - MQ2");
                mq2.setType(DeviceType.MQ2.getId());
                mq2.setPort("COM3");
                devices.add(mq2);

                DeviceEntity dht11 = new DeviceEntity();
                dht11.setName("Cảm biến khí Gas - DHT11");
                dht11.setType(DeviceType.DHT11.getId());
                dht11.setPort("COM3");
                devices.add(dht11);

                mq2 = deviceTable.save(mq2);
                dht11 = deviceTable.save(dht11);

                if (logWarningTable.count() == 0) {
                    List<LogWarningEntity> warnings = new ArrayList<>();

                    for (int i = 0; i < 20; i++) {
                        LogWarningEntity warning = new LogWarningEntity();
                        warning.setDeviceId(mq2.getId());
                        warning.setMessage("");
                        warning.setType(WarningType.GAS_CONCENTRATION.getId());
                        warning.setValue((float) (Math.random() * 1000));
                        warning.setUnit(UnitType.CONCENTRATION.getId());
                        warnings.add(warning);
                    }

                    for (int i = 0; i < 20; i++) {
                        LogWarningEntity warning = new LogWarningEntity();
                        warning.setDeviceId(dht11.getId());
                        warning.setMessage("");
                        warning.setType(WarningType.TEMPERATURE.getId());
                        warning.setValue((float) (Math.random() * 100));
                        warning.setUnit(UnitType.CELSIUS.getId());
                        warnings.add(warning);
                    }

                    logWarningTable.saveAll(warnings);
                }

                if (configLimitWarningTable.count() == 0) {
                    // fake config limit warning
                    List<ConfigLimitWarningEntity> configs = new ArrayList<>();

                    ConfigLimitWarningEntity configMQ2 = new ConfigLimitWarningEntity();
                    configMQ2.setDeviceId(mq2.getId());
                    configMQ2.setValue(1000F);
                    configMQ2.setType(DeviceType.MQ2.getId());
                    configMQ2.setUnit(UnitType.CONCENTRATION.getId());
                    configs.add(configMQ2);

                    ConfigLimitWarningEntity configDHT11 = new ConfigLimitWarningEntity();
                    configDHT11.setDeviceId(dht11.getId());
                    configDHT11.setValue(100F);
                    configDHT11.setType(DeviceType.DHT11.getId());
                    configDHT11.setUnit(UnitType.CELSIUS.getId());
                    configs.add(configDHT11);

                    configLimitWarningTable.saveAll(configs);
                }

                if (temperatureSensorDeviceLogTable.count() == 0) {
                    List<TemperatureSensorDeviceLogEntity> temps = new ArrayList<>();

                    for (int i = 1; i <= 100; i++) {
                        TemperatureSensorDeviceLogEntity temp = new TemperatureSensorDeviceLogEntity();
                        temp.setDeviceId(dht11.getId());
                        temp.setAction(ActionType.READ_TEMP.getId());
                        temp.setTemperature((float) (Math.random() * 100));
                        temp.setHumidity((float) (Math.random() * 100));
                        temp.setDescription("");
                        temp.setCreated(LocalDateTime.now());
                        temps.add(temp);
                    }
                    temperatureSensorDeviceLogTable.saveAll(temps);
                }

                if (gasSensorDeviceLogTable.count() == 0) {
                    List<GasSensorDeviceLogEntity> gas = new ArrayList<>();
                    for (int i = 1; i <= 100; i++) {
                        GasSensorDeviceLogEntity g = new GasSensorDeviceLogEntity();
                        g.setDeviceId(mq2.getId());
                        g.setAction(ActionType.READ_GAS.getId());
                        g.setConcentrations((float) (Math.random() * 1000));
                        g.setDescription("");
                        g.setCreated(LocalDateTime.now());
                        g.setCreated(LocalDateTime.now());
                        gas.add(g);
                    }
                    gasSensorDeviceLogTable.saveAll(gas);
                }
            }

            if (userTable.findByUsername("admin") == null || userTable.count() == 0) {
                // Fake users
                List<UserEntity> others = new ArrayList<>();
                for (int i = 1; i <= 30; i++) {
                    UserEntity other = new UserEntity();
                    other.setUsername("user" + i);
                    other.setEmail("user" + i + "@gmail.com");
                    other.setFirstName("user");
                    other.setLastName(" " + i);
                    other.setGroupId(UserGroup.USER.getId());
                    other.setBirthday(LocalDate.now());
                    other.setPassword(passwordEncoder().encode("12345678"));
                    other.setIamId(UlidCreator.getUlid().toString());
                    others.add(other);
                }
                userTable.saveAll(others);

                // Fake admin
                UserEntity userEntity = new UserEntity();
                userEntity.setUsername("admin");
                userEntity.setEmail("admin@gmail.com");
                userEntity.setFirstName("Super");
                userEntity.setLastName("Admin");
                userEntity.setGroupId(UserGroup.SUPER_ADMIN.getId());
                userEntity.setBirthday(LocalDate.now());
                userEntity.setPassword(passwordEncoder().encode("admin"));
                userEntity.setIamId(UlidCreator.getUlid().toString());
                UserEntity admin = userTable.save(userEntity);

                // Fake scope
                List<String> scopes = List.of(
                        "inter:read",
                        "inter:write",
                        "auth:account.read",
                        "auth:account.write"
                );
                List<IamScopeEntity> iamScopeEntities = new ArrayList<>();

                scopes.forEach(scope -> {
                    IamScopeEntity iamScopeEntity = new IamScopeEntity();
                    iamScopeEntity.setScope(scope);
                    iamScopeEntities.add(iamScopeEntity);
                });

                List<IamScopeEntity> scopeEntities = iamScopeTable.saveAll(iamScopeEntities);

                List<UserScopeEntity> userScopeEntities = new ArrayList<>();

                scopeEntities.forEach(scopeEntity -> {
                    UserScopeEntity userScopeEntity = new UserScopeEntity();
                    userScopeEntity.setScopeId(scopeEntity.getId());
                    userScopeEntity.setUserId(admin.getId());
                    userScopeEntities.add(userScopeEntity);
                });

                userScopeTable.saveAll(userScopeEntities);
            }

            log.info("Application running...");
        };
    }
}