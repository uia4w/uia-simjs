import Event from "./event"

/**
 * The source observable.
 * 
 * @constructor
 * @class
 * 
 * @param {Env} env The environment.
 * @param {string} id The id. 
 */
function Observable(env, id) {
    this._env = env;
    this._id = id;
    this._notifyEvent = new Event(env, id);
}

/**
 * Asks an event which will be trigged when the source is available.
 * 
 * @returns An event.
 */
Observable.prototype.ask = function() {
    return this._notifyEvent;
}

/**
 * Notifies source is available.
 * 
 * @param {any} source The source.
 */
Observable.prototype.available = function(source) {
    if (this._notifyEvent.hasCallbacks()) {
        this._notifyEvent.succeed(source);
        this._notifyEvent = new Event(this._env, this.id);
    }
}

export default Observable;