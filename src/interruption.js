import Event from "./event"
import Process from "./process";

/**
 * Immediately schedules an Interruption event with the given cause to be thrown into the process.
 * 
 *  This event is automatically triggered when it is created.
 * 
 * @param {Process} process The process will be interrupted.
 * @param {Error} cause The cause.
 */
function Interruption(process, cause) {
    Event.apply(this, [ process.env(), "Interruption" ]);
    let _process = process;

    this._value = cause;
    this.ng();
    this.defused();
    this.addCallback(function(event) {
        _process.unbind(_process._target);
        _process.resume(this);
    });
    env.schedule(this, delay);
}

Interruption.prototype = new Event();

export default Interruption;
