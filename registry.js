"use strict";

let EXACT_COMMANDS = {};
let PREFIX_COMMANDS = {};

class Registry {


  static registerExactCommand(commandStr, callback) {
    EXACT_COMMANDS[commandStr] = callback;
  }

  static registerPrefixCommand(commandStr, callback) {
    PREFIX_COMMANDS[commandStr] = callback;
  }

  static getExactCommandCallbacks() {
    return EXACT_COMMANDS;
  }

  static getPrefixCommandCallbacks() {
    return PREFIX_COMMANDS;
  }
}

module.exports = Registry;