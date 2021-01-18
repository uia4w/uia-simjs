/**
 * @module Env
 *
 * @author Kyle K. Lin 
 */

import TinyQueue from "tinyqueue"
import Event from "./event"
import Process from "./process"
import Timeout from "./timeout"
import { Priority } from "./constants"

/**
 * The discrete event simulation environment.
 * 
 * @constructor
 * @class
 * 
 */
function Env() {
    const _queue = new TinyQueue([], function(j1, j2) {
        var c = j1.time - j2.time;
        if(c != 0) {
            return c;
        }
        return j1.priority - j2.priority;
    });
    this._now = 0;
    this._activeProcess = undefined;
    this.queue = function() { return _queue };
}

/**
 * Returns current time.
 * 
 * @returns The current time.
 */
Env.prototype.now = function() {
    return this._now;
}

/**
 * Sets the active process.
 * 
 * @param {Process} process The process.
 */
Env.prototype.activeProcess = function(process) {
    this._activeProcess = process;
}

/**
 * Runs the environment.
 * 
 * @param {number} until The end time.
 */
Env.prototype.run = function(until = 0) {
    console.log("=== start ===");
    try {
        if(until > 0) {
            let stopEvent = new Event(this, "StopSim");
            stopEvent.addCallback(function() {
                throw new Error("time up interruption");
            });
            this.schedule(stopEvent, until, this._now);
        }

        while(this.queue().length !== 0 && (until <= 0 || this._now < until)) {
            this.step();
        }

        console.log("=== end ===");
    } catch(err) {
        console.log(err.message);
        console.log("=== end with exception ===");
    }
}

/**
 * Executes the first event in the queue.
 * 
 */
Env.prototype.step = function() {
    // 1. get the first job.
    var job = this.queue().pop();

    // 2. update environment time
    this._now = job.time;

    // 3. callback the event.
    job.event.callback();

    // 4. check if event is OK.
}

/**
 * __Schedules__ an event in the queue.
 * 
 * @param {Event} event The event.
 * @param {number} delay The delay time.
 * @param {number} priority The priority.
 */
Env.prototype.schedule = function(event, delay = 0, priority = Priority.NORMAL) {
    this.queue().push(job(event, this._now + delay, priority));
}

/**
 * Creates an event.
 * 
 * @param {string} id The event id.
 * @param {any} value The event value.
 * @returns {Event} A new event.
 */
Env.prototype.event = function(id, value = undefined) {
    return new Event(this, id, value);
}

/**
 * Creates a __scheduled__ timeout event.
 * 
 * @param {string} id The event id.
 * @param {number} delay The delay time.
 * @param {any} value The event value.
 * @returns {Timeout} A timeout event.
 */
Env.prototype.timeout = function(id, delay = 0, value = null) {
    return new Timeout(this, id, delay, value);
}

/**
 * Creates a __scheduled__ timeout event.
 * 
 * @param {string} id The event id.
 * @param {Generator} gen The generator.
 * @param {any} value The event value.
 * @returns {Timeout} A timeout event.
 */
Env.prototype.process = function(id, gen) {
    return new Process(this, id, gen);
}

/**
 * Creates a job.
 * 
 * @param {Event} event The event.
 * @param {number} time The scheduled time.
 * @param {number} priority The priority.
 */
function job(event, time, priority = Priority.NORMAL) {
    return Object.freeze({
        "id": event.id(),
        "event": event,
        "time": time,
        "priority": priority
    });
}

export default Env;
