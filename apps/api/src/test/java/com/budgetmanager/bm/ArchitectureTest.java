package com.budgetmanager.bm;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(
    packages = "com.budgetmanager.bm",
    importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

  @ArchTest
  static final ArchRule DOMAIN_DOES_NOT_DEPEND_ON_APPLICATION_OR_INFRASTRUCTURE =
      noClasses()
          .that()
          .resideInAPackage("..domain..")
          .should()
          .dependOnClassesThat()
          .resideInAnyPackage("..application..", "..infrastructure..");

  @ArchTest
  static final ArchRule HTTP_ADAPTERS_DO_NOT_ACCESS_PERSISTENCE =
      noClasses()
          .that()
          .resideInAPackage("..infrastructure.http..")
          .should()
          .dependOnClassesThat()
          .resideInAPackage("..infrastructure.persistence..");

  @ArchTest
  static final ArchRule DOMAIN_DOES_NOT_DEPEND_ON_SPRING_SECURITY =
      noClasses()
          .that()
          .resideInAnyPackage("..domain..", "..enums..")
          .should()
          .dependOnClassesThat()
          .resideInAPackage("org.springframework.security..");
}
