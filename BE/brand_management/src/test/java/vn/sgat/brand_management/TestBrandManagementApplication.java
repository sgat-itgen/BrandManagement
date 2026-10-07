package vn.sgat.brand_management;

import org.springframework.boot.SpringApplication;

public class TestBrandManagementApplication {

    public static void main(String[] args) {
        SpringApplication.from(BrandManagementApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
