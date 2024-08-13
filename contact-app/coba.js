const EventEmitter = require("events");

const createEE = ({ fn, interval, signal }) => {
  const e = new EventEmitter();
  return e;
};
