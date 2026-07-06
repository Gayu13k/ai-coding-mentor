package com.aimentor.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Programmatic DataSource configuration.
 *
 * On Railway: DATABASE_URL is auto-set by the PostgreSQL plugin as
 *   postgres://user:pass@host:port/dbname
 * This class parses it and creates a PostgreSQL DataSource automatically.
 *
 * Locally: DATABASE_URL is not set → falls back to H2 file database.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            log.info("DATABASE_URL detected — configuring PostgreSQL DataSource");
            try {
                // Railway format: postgres://user:pass@host:port/dbname
                // Replace "postgres://" with "postgresql://" for URI parsing
                String normalised = databaseUrl.startsWith("postgres://")
                        ? databaseUrl.replaceFirst("postgres://", "postgresql://")
                        : databaseUrl;

                URI uri = new URI(normalised);
                String[] userInfo = uri.getUserInfo().split(":", 2);

                String portStr = uri.getPort() != -1 ? ":" + uri.getPort() : "";
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost()
                        + portStr
                        + uri.getPath()
                        + "?sslmode=require";

                log.info("Connecting to PostgreSQL at {}:{}", uri.getHost(), uri.getPort());

                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(userInfo[0]);
                config.setPassword(userInfo.length > 1 ? userInfo[1] : "");
                config.setDriverClassName("org.postgresql.Driver");
                config.setMaximumPoolSize(5);
                config.setConnectionTimeout(30000);
                return new HikariDataSource(config);

            } catch (Exception e) {
                throw new RuntimeException("Failed to parse DATABASE_URL: " + e.getMessage(), e);
            }
        }

        // Local H2 fallback
        log.info("No DATABASE_URL set — using local H2 file database");
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:file:./data/ai_mentor_db;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE");
        config.setUsername("sa");
        config.setPassword("password");
        config.setDriverClassName("org.h2.Driver");
        return new HikariDataSource(config);
    }
}
