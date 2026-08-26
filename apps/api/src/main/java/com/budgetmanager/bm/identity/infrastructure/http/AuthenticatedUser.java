package com.budgetmanager.bm.identity.infrastructure.http;

import java.util.List;
import java.util.UUID;

public record AuthenticatedUser(UUID id, String username, List<String> roles) {

  public AuthenticatedUser {
    roles = List.copyOf(roles);
  }
}
