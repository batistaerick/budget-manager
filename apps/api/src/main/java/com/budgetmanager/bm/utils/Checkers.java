package com.budgetmanager.bm.utils;

import java.util.regex.Pattern;

public final class Checkers {

  private Checkers() {}

  public static boolean isPasswordCorrect(String password) {
    if (password == null) {
      return false;
    }
    return Pattern.compile(
            "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&.])[A-Za-z\\d@$!%*?&.]{8,20}$")
        .matcher(password)
        .matches();
  }
}
