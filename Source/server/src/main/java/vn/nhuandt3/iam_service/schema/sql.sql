CREATE TABLE `gas_sensor_device_logs`
(
    `id`             bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `device_id`      int unsigned        NOT NULL DEFAULT 0 COMMENT 'id của thiết bị',
    `action`         varchar(50) NOT NULL DEFAULT '' COMMENT 'action',
    `concentrations` float unsigned      NOT NULL DEFAULT 0 COMMENT 'Nồng độ đo được',
    `description`    text COMMENT 'Mô tả',
    `created`        timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Nồng độ được do vào lúc',
    PRIMARY KEY (`id`, `created`),
    KEY              `idx_concentrations` (`concentrations`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'Logs đo nồng độ khí gas';

CREATE TABLE `temperature_sensor_device_logs`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `device_id`   int unsigned        NOT NULL DEFAULT 0 COMMENT 'id của thiết bị',
    `action`      varchar(50) NOT NULL DEFAULT '' COMMENT 'action',
    `temperature` float unsigned      NOT NULL DEFAULT 0 COMMENT 'Nhiệt độ',
    `humidity`    float unsigned      NOT NULL DEFAULT 0 COMMENT 'Độ ẩm',
    `description` text COMMENT 'Mô tả',
    `created`     timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Nhiệt độ và độ ẩm được do vào lúc',
    PRIMARY KEY (`id`, `created`),
    KEY           `idx_temperature` (`temperature`),
    KEY           `idx_humidity` (`humidity`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'Logs đo nhiệt độ và độ ẩm';

CREATE TABLE `users`
(
    `id`         int unsigned NOT NULL AUTO_INCREMENT,
    `username`   varchar(50)  NOT NULL DEFAULT '' COMMENT 'Tên đăng nhập',
    `email`      varchar(100) NOT NULL DEFAULT '' COMMENT 'Email',
    `password`   varchar(100) NOT NULL DEFAULT '' COMMENT 'Mật khẩu',
    `phone`      varchar(20)           DEFAULT NULL COMMENT 'SDT',
    `first_name` varchar(30)           DEFAULT NULL COMMENT 'first name',
    `last_name`  varchar(30)           DEFAULT NULL COMMENT 'last name',
    `birthday`   date                  DEFAULT NULL COMMENT 'birthday',
    `iam_id`     varchar(255) NOT NULL DEFAULT '' COMMENT 'iam_id',
    `group_id`   int          NOT NULL DEFAULT 0 COMMENT 'group_id',
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created at',
    `updated_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'updated at',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_username` (`username`),
    UNIQUE KEY `idx_email` (`email`),
    UNIQUE KEY `idx_iam_id` (`iam_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'users';

CREATE TABLE `users_scopes`
(
    `id`         bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `user_id`    bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT 'user_id',
    `scope_id`   bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT 'scope_id',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created at',
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'updated at',
    PRIMARY KEY (`id`),
    INDEX        `idx_user_scope_id` (`user_id`, `scope_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'users_scopes';

CREATE TABLE `iam_tokens`
(
    `id`         bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `jwt_id`     varchar(255) NOT NULL DEFAULT '' COMMENT 'jwt id',
    `token`      varchar(255) NOT NULL DEFAULT '' COMMENT 'token',
    `expires_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'expires at',
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created at',
    `updated_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'updated at',
    PRIMARY KEY (`id`),
    INDEX        `idx_jwt_id` (`jwt_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'iam_tokens';

CREATE TABLE `iam_scopes`
(
    `id`         bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `scope`      varchar(50) NOT NULL DEFAULT '0' COMMENT 'scope',
    `created_at` timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created at',
    `updated_at` timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'updated at',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT 'iam_scopes';