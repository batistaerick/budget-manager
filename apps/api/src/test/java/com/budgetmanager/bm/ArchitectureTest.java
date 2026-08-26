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
  static final ArchRule domainDoesNotDependOnDeliveryOrPersistence =
      noClasses()
          .that()
          .resideInAnyPackage("..domain..", "..enums..")
          .should()
          .dependOnClassesThat()
          .resideInAnyPackage(
              "com.budgetmanager.bm.controllers..",
              "com.budgetmanager.bm.repositories..",
              "com.budgetmanager.bm.security..");

  @ArchTest
  static final ArchRule controllersDoNotAccessRepositories =
      noClasses()
          .that()
          .resideInAPackage("..controllers..")
          .should()
          .dependOnClassesThat()
          .resideInAPackage("..repositories..");

  @ArchTest
  static final ArchRule domainDoesNotDependOnSpringSecurity =
      noClasses()
          .that()
          .resideInAnyPackage("..domain..", "..enums..")
          .should()
          .dependOnClassesThat()
          .resideInAPackage("org.springframework.security..");
}
