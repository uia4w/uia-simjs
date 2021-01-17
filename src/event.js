import { default as Env, Priority } from "./env"

export const PENDING = new Object();

/**
 * The constructor.
 * 
 * @param {Env} env The environment.
 * @param {string} id The event id.
 */
export default function Event(env, id) {
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

Event.prototype.isTriggered = function() {
    return this._value !== PENDING;
}

Event.prototype.isDefused = function() {
    return this._defused;
}

Event.prototype.isProcessed = function() {
    return this._callbacks === undefined;
}

Event.prototype.value = function(v) {
    if(v === undefined) {
        return this._value;
    } else {
        this._value = value;
        return this;
    }
}

Event.prototype.trigger = function(event) {
    this._ok = event.isOk();
    this._value = event.value();
    this.env().schedule(this);
}

Event.prototype.succeed = function(value = undefined, priority = Priority.NORMAL) {
    this._ok = true;
    this._value = value;
    this.env().schedule(this, 0, priority);
}

/**
 *  Marks the event as failed with a cause and
 *  __schedule__ it for processing by the environment.
 * 
 * @param {Error} cause 
 */
Event.prototype.failed = function(cause) {
    this._ok = false;
    this._value = cause;
    this.env().schedule(this, 0, Priority.NORMAL);
}

Event.prototype.ng = function() {
    this._ok = false;
}

Event.prototype.defused = function() {
    this._defused = true;
}

Event.prototype.addCallback = function(callback) {
    if(!this._callbacks || !callback) {
        return;
    }
    let idx = this._callbacks.indexOf(callback);
    if(idx < 0) {
        this._callbacks.push(callback);
    }
}

Event.prototype.removeCallback = function(callback) {
    if(!this._callbacks || !callback) {
        return;
    }
    let idx = this._callbacks.indexOf(callback);
    if (index > -1) {
        this._callbacks.splice(index, 1);
    }
}

/**
 * Execute the callbacks and change the state to 'processed'
 * 
 */
Event.prototype.callback = function() {
    if(!this._callbacks) {
        return;
    }
    try {
        while(this._callbacks.length != 0) {
            this._callbacks.shift()(this);
        }
    } finally {
        this._callbacks = undefined;
    }
}
