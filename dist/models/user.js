"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var UserSchema = new _mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var UserModel = (0, _mongoose.model)('user', UserSchema);
var _default = UserModel;
exports["default"] = _default;