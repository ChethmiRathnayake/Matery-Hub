package com.example.masteryhub.Repository;

import com.example.masteryhub.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
