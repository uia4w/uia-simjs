/**
 * 
 */
import Event from "./event"

/**
 * The process event.
 * 
 * @constructor
 * @class
 * @extends Event
 * 
 * @param {Env} env The environment.
 * @param {string} id The process id. 
 * @param {Array} events The events.
 */
function Condition(env, id, events) {
    Event.apply(this, [ env, id ]);
    this._events = events;
    this.addCallback(buildValue);

    function buildValue(event) {
        this.removeCheck();
        if(event.isOk()) {
            var cv = null;
            setValue(cv);
            populateValue(cv);
        }
    }

    function populateValue(cv) {
        this._events.forEach(e => {
            e.removeCallback(this._handle);
            if(typeof e === Condition) {
                e.populateValue(cv);
            } else {
                cv._events.push(e);
            }
        });
    }
}

Condition.prototype = new Event();

/**
 * Checks.
 * 
 * @param {Event} event The event.
 */
Condition.prototype.check = function(event) {
    if(this.isTriggered()) {
        return;
    }

    if(!event.isOk()) {
        event.defused();
    } else if(this.evaluate(this.events)) {
        succeed(null);
    }
}

Condition.prototype.removeCheck = function(event) {
    this._events.forEach(e => {
        e.removeCallback(this.handle);
        if(typeof e === Condition) {
            e.removeCheck();
        }
    });
}

Condition.prototype.evaluate = function(events) {
    return true;
}

export default Condition;