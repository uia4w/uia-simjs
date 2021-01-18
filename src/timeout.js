/**
 * @module Timeout
 *
 * @author Kyle K. Lin 
 */

 import Event from "./event"

/**
 * The timeout event.
 * 
 * @constructor
 * @class
 * @extends Event

 * @param {Env} env The environment
 * @param {string} id  The event id. Default is 'timeout'.
 * @param {number} delay The delay time. Default is zero.
 * @param {any} value The event value. Default is undefined.
 */
function Timeout(env, id = "timeout", delay = 0, value = undefined) {
    Event.apply(this, [ env, id ]);
    this._value = value;
    env.schedule(this, delay);
}

Timeout.prototype = new Event();

export default Timeout;
