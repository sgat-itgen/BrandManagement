package vn.sgat.brand_management.features.trademarks;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import vn.sgat.brand_management.features.auth.domain.User;
import vn.sgat.brand_management.features.auth.domain.UserRole;
import vn.sgat.brand_management.features.auth.repository.UserRepository;
import vn.sgat.brand_management.features.companies.domain.Company;
import vn.sgat.brand_management.features.companies.repository.CompanyRepository;
import vn.sgat.brand_management.features.trademarks.repository.TrademarkRecordRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TrademarkApiTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private TrademarkRecordRepository trademarkRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        trademarkRecordRepository.deleteAll();
        userRepository.deleteAll();
        companyRepository.deleteAll();

        Company company = new Company();
        company.setCode("TNHH");
        company.setLegalName("CTY TNHH An Thái");
        companyRepository.save(company);

        User user = new User();
        user.setEmail("admin@example.com");
        user.setFullName("Admin Test");
        user.setPasswordHash(passwordEncoder.encode("secret123"));
        user.setRole(UserRole.ADMIN);
        userRepository.save(user);
    }

    @Test
    void loginAndCreateTrademark() throws Exception {
        var login = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@example.com\",\"password\":\"secret123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("admin"))
            .andReturn();

        MockHttpSession session = (MockHttpSession) login.getRequest().getSession(false);

        mockMvc.perform(post("/api/trademarks")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "companyCode": "TNHH",
                      "markName": "An Thái Coffee",
                      "markType": "Logo",
                      "status": "pending",
                      "classNumbers": [30, 43],
                      "applicationNo": "4-2026-00001"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mark").value("An Thái Coffee"))
            .andExpect(jsonPath("$.company.code").value("TNHH"))
            .andExpect(jsonPath("$.groups[0]").value(30));

        mockMvc.perform(get("/api/trademarks").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].mark").value("An Thái Coffee"));

        if (session == null) {
            throw new AssertionError("Session cookie không được tạo");
        }
    }
}
