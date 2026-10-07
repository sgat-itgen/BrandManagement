package vn.sgat.brand_management.features.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.sgat.brand_management.features.auth.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
}
