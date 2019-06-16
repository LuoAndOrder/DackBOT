"use strict";

let EXACT_COMMANDS = {};
let PREFIX_COMMANDS = {};
let REGEX_COMMANDS = {};

class Registry {


  static registerExactCommand(commandStr, callback) {
    EXACT_COMMANDS[commandStr] = callback;
  }

  static registerPrefixCommand(commandStr, callback) {
    PREFIX_COMMANDS[commandStr] = callback;
  }

  static registerRegexCommand(regexStr, callback) {
    REGEX_COMMANDS[regexStr] = callback;
  }

  static getExactCommandCallbacks() {
    return EXACT_COMMANDS;
  }

  static getPrefixCommandCallbacks() {
    return PREFIX_COMMANDS;
  }

  static getRegexCommandCallbacks() {
    return REGEX_COMMANDS;
  }
}

module.exports = Registry;