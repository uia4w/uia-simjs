import Env from "./env"
import Event from "./event"

/**
 * 
 * @param {Env} env The environment
 * @param {string} id  The event id.
 * @param {number} delay The delay time.
 * @param {any} value The event value.
 */
function Timeout(env, id = "timeout", delay = 0, value = undefined) {
    Event.apply(this, [ env, id ]);
    this._value = value;
    env.schedule(this, delay);
}

Timeout.prototype = new Event();

export default Timeout;
