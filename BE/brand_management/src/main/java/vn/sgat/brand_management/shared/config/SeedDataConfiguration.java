package vn.sgat.brand_management.shared.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.sgat.brand_management.features.agencies.domain.Agency;
import vn.sgat.brand_management.features.agencies.repository.AgencyRepository;
import vn.sgat.brand_management.features.auth.domain.User;
import vn.sgat.brand_management.features.auth.domain.UserRole;
import vn.sgat.brand_management.features.auth.repository.UserRepository;
import vn.sgat.brand_management.features.companies.domain.Company;
import vn.sgat.brand_management.features.companies.repository.CompanyRepository;
import vn.sgat.brand_management.features.trademarks.domain.NiceClass;
import vn.sgat.brand_management.features.trademarks.repository.NiceClassRepository;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class SeedDataConfiguration {
    private final CompanyRepository companyRepository;
    private final AgencyRepository agencyRepository;
    private final NiceClassRepository niceClassRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    SeedDataRunner seedDataRunner(
        @Value("${APP_DEFAULT_ADMIN_EMAIL:phapche@saigonanthai.vn}") String defaultEmail,
        @Value("${APP_DEFAULT_ADMIN_PASSWORD:demo123}") String defaultPassword
    ) {
        return new SeedDataRunner(defaultEmail, defaultPassword);
    }

    final class SeedDataRunner implements org.springframework.boot.CommandLineRunner {
        private final String defaultEmail;
        private final String defaultPassword;

        private SeedDataRunner(String defaultEmail, String defaultPassword) {
            this.defaultEmail = defaultEmail;
            this.defaultPassword = defaultPassword;
        }

        @Override
        public void run(String... args) {
            seedCompanies();
            seedAgencies();
            seedNiceClasses();
            seedAdmin();
        }

        private void seedCompanies() {
            List.of(
                new String[]{"TNHH", "CTY TNHH An Thái"},
                new String[]{"SGAT", "CTY CP Sài Gòn An Thái"},
                new String[]{"DTPT", "CTY CP ĐT & PT An Thái"},
                new String[]{"SXTM", "CTY CP SX TM An Thái Việt Nam"}
            ).forEach(item -> companyRepository.findByCodeIgnoreCase(item[0]).orElseGet(() -> {
                Company company = new Company();
                company.setCode(item[0]);
                company.setLegalName(item[1]);
                return companyRepository.save(company);
            }));
        }

        private void seedAgencies() {
            List.of(
                "Ban Ca",
                "Cty Luật TNHH Tư vấn Quốc tế (Indochine Counsel)",
                "Cty CP SHTT Bross và Cộng sự",
                "Cty Luật Thịnh Hải",
                "Asoka Law & Partners",
                "Cty Luật TNHH Bản quyền Quốc tế"
            ).forEach(name -> agencyRepository.findByNameIgnoreCase(name).orElseGet(() -> {
                Agency agency = new Agency();
                agency.setName(name);
                return agencyRepository.save(agency);
            }));
        }

        private void seedNiceClasses() {
            List.of(11, 29, 30, 31, 32, 35, 36, 39, 43).forEach(number ->
                niceClassRepository.findById(number).orElseGet(() -> {
                    NiceClass niceClass = new NiceClass();
                    niceClass.setClassNo(number);
                    niceClass.setName("Nhóm " + number);
                    return niceClassRepository.save(niceClass);
                })
            );
        }

        private void seedAdmin() {
            userRepository.findByEmailIgnoreCase(defaultEmail).orElseGet(() -> {
                User user = new User();
                user.setEmail(defaultEmail.trim().toLowerCase());
                user.setFullName("Nhóm pháp chế An Thái");
                user.setPasswordHash(passwordEncoder.encode(defaultPassword));
                user.setRole(UserRole.ADMIN);
                return userRepository.save(user);
            });
        }
    }
}
