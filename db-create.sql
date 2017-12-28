-- MySQL Script generated by MySQL Workbench
-- Thu Dec 28 13:27:47 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema issue_tracker
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema issue_tracker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `issue_tracker` DEFAULT CHARACTER SET utf8 ;
USE `issue_tracker` ;

-- -----------------------------------------------------
-- Table `issue_tracker`.`sprints`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`sprints` (
  `SPRINT_ID` INT NOT NULL AUTO_INCREMENT,
  `SPRINT_START` INT(12) NOT NULL,
  `SPRINT_LENGTH` INT(12) NOT NULL,
  PRIMARY KEY (`SPRINT_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`colour_schemes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`colour_schemes` (
  `SCHEME_ID` INT NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(64) NOT NULL,
  `RESOLVE_COLOUR` VARCHAR(7) NULL,
  `CLOSE_COLOUR` VARCHAR(7) NULL,
  `IN_PROGRESS_COLOUR` VARCHAR(7) NULL,
  `AWAITING_START_COLOUR` VARCHAR(7) NULL,
  `DEFAULT_COLOUR` VARCHAR(7) NOT NULL,
  PRIMARY KEY (`SCHEME_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`teams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`teams` (
  `TEAM_ID` INT NOT NULL AUTO_INCREMENT,
  `TEAM_NAME` VARCHAR(45) NOT NULL,
  `SCHEME_ID` INT NOT NULL,
  PRIMARY KEY (`TEAM_ID`),
  INDEX `fk_teams_colour_schemes1_idx` (`SCHEME_ID` ASC),
  CONSTRAINT `fk_teams_colour_schemes1`
    FOREIGN KEY (`SCHEME_ID`)
    REFERENCES `issue_tracker`.`colour_schemes` (`SCHEME_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`tiers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`tiers` (
  `TIER` VARCHAR(32) NOT NULL,
  `COST` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`TIER`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`users` (
  `EMP_ID` INT NOT NULL AUTO_INCREMENT,
  `EMAIL` VARCHAR(45) NOT NULL,
  `HASHED_PASS` VARCHAR(60) NOT NULL,
  `FIRST_NAME` VARCHAR(45) NOT NULL,
  `SURNAME` VARCHAR(45) NOT NULL,
  `CAPACITY` DECIMAL(3,2) NOT NULL,
  `ROLE` INT(1) NOT NULL DEFAULT 0,
  `TEAM_ID` INT NOT NULL,
  `TIER` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`EMP_ID`),
  INDEX `fk_employees_teams1_idx` (`TEAM_ID` ASC),
  INDEX `fk_employees_tiers1_idx` (`TIER` ASC),
  UNIQUE INDEX `EMAIL_UNIQUE` (`EMAIL` ASC),
  CONSTRAINT `fk_employees_teams1`
    FOREIGN KEY (`TEAM_ID`)
    REFERENCES `issue_tracker`.`teams` (`TEAM_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_employees_tiers1`
    FOREIGN KEY (`TIER`)
    REFERENCES `issue_tracker`.`tiers` (`TIER`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`issues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`issues` (
  `ISSUE_ID` VARCHAR(32) NOT NULL,
  `TITLE` VARCHAR(45) NOT NULL,
  `DESCRIPTION` VARCHAR(256) NOT NULL,
  `STATE` VARCHAR(32) NOT NULL,
  `TOTAL_SECONDS_LOGGED` INT(12) NOT NULL,
  `ESTIMATED_TIME` INT(12) NOT NULL,
  `EMP_ID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`ISSUE_ID`),
  INDEX `fk_issues_users1_idx` (`EMP_ID` ASC),
  CONSTRAINT `fk_issues_users1`
    FOREIGN KEY (`EMP_ID`)
    REFERENCES `issue_tracker`.`users` (`EMP_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue_tracker`.`work_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue_tracker`.`work_log` (
  `SPRINT_ID` INT NOT NULL,
  `ISSUE_ID` VARCHAR(32) NOT NULL,
  `SECONDS_LOGGED` INT(12) NOT NULL,
  INDEX `fk_work_log_issues1_idx` (`ISSUE_ID` ASC),
  INDEX `fk_work_log_sprints1_idx` (`SPRINT_ID` ASC),
  CONSTRAINT `fk_work_log_issues1`
    FOREIGN KEY (`ISSUE_ID`)
    REFERENCES `issue_tracker`.`issues` (`ISSUE_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_work_log_sprints1`
    FOREIGN KEY (`SPRINT_ID`)
    REFERENCES `issue_tracker`.`sprints` (`SPRINT_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
