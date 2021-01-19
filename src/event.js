/**
 * @module Event
 *
 * @author Kyle K. Lin 
 */

 import { Priority } from "./constants"

const PENDING = new Object();

/**
 * The main event.
 * 
 * @constructor
 * @class
 * 
 * @param {Env} env The environment.
 * @param {string} id The event id.
 */
function Event(env, id) {
    const _env = env;
    const _id = id;

    this._value = PENDING;
    this._ok = true;
    this._defused = false;
    this._callbacks = [];

    this.env = function() { return _env; }
    this.id = function() { return _id; }
}

/**
 * Tests if the event is ok.
 * 
 * @returns Ok or not.
 */
Event.prototype.isOk = function() {
    return this._ok;
}

/**
 * Tests is the event is triggered and __schedule__ in the queue.
 * 
 * @returns True is the event is triggered.
 */
Event.prototype.isTriggered = function() {
    return this._value !== PENDING;
}

/**
 * Tests is the event is defused.
 * 
 * @returns True is the event is defused.
 */
Event.prototype.isDefused = function() {
    return this._defused;
}

/**
 * Tests is the event is processed.
 * 
 * @returns True is the event is processed.
 */
Event.prototype.isProcessed = function() {
    return this._callbacks === undefined;
}

/**
 * Returns the event value.
 * 
 * @returns The event value.
 */
Event.prototype.value = function() {
    return this._value;
}

/**
 * __Schedules__ this event in the queue based on the source event.
 * 
 * @param {Event} event The source event.
 */
Event.prototype.trigger = function(event) {
    this._ok = event.isOk();
    this._value = event.value();
    this.env().schedule(this);
}

/**
 * Marks the event as Ok with a value and __schedule__ it in the queue.
 * 
 * @param {any} value The event value.
 * @param {number} priority The priority.
 */
Event.prototype.succeed = function(value = undefined, priority = Priority.NORMAL) {
    this._ok = true;
    this._value = value;
    this.env().schedule(this, 0, priority);
}

/**
 * Marks the event as failed with a cause and __schedule__ it in the queue.
 * 
 * @param {Error} cause The cause of failed.
 */
Event.prototype.failed = function(cause) {
    this._ok = false;
    this._value = cause;
    this.env().schedule(this, 0, Priority.NORMAL);
}

/**
 * Marks the event as NG.
 * 
 */
Event.prototype.ng = function() {
    this._ok = false;
}

/**
 * Marks the event as defused.
 * 
 */
Event.prototype.defused = function() {
    this._defused = true;
}

/**
 * Adds a callback function.
 * 
 * @param {function} callback A callback function with 1 argument which type is Event.
 * @returns True if the callback is added.
 */
Event.prototype.addCallback = function(callback) {
    if(!this._callbacks || !callback) {
        return;
    }
    let idx = this._callbacks.indexOf(callback);
    if(idx < 0) {
        this._callbacks.push(callback);
        return true;
    } else {
        return false;
    }
}

/**
 * Removes a callback function.
 * 
 * @param {*} callback  A callback function.
 * @returns True if the callback is removed.
 */
Event.prototype.removeCallback = function(callback) {
    if(!this._callbacks || !callback) {
        return;
    }
    let idx = this._callbacks.indexOf(callback);
    if (idx >= 0) {
        this._callbacks.splice(idx, 1);
        return true;
    } else {
        return false;
    }
}

/**
 * Executes all added callbacks and change the state to 'processed'
 * 
 */
Event.prototype.callback = function() {
    if(!this._callbacks) {
        return;
    }
    try {
        while(this._callbacks.length !== 0) {
            this._callbacks.shift()(this);
        }
    } finally {
        this._callbacks = undefined;
    }
}

export default Event;
