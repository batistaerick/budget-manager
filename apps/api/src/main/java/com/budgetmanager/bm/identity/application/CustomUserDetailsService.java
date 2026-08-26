package com.budgetmanager.bm.identity.application;

import com.budgetmanager.bm.identity.domain.User;
import com.budgetmanager.bm.identity.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository repository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user =
        repository
            .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    String[] authorities =
        user.getRoles().stream().map(role -> role.getRoleName().toString()).toArray(String[]::new);

    return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
        .password(user.getPassword())
        .authorities(authorities)
        .build();
  }
}
