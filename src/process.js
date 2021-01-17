import { default as Env, Priority } from "./env"
import Event from "./event"
import Interruption from "./interruption"

/**
 * The process main object.
 * 
 * @param {Env} env The environment.
 * @param {string} id The process id. 
 * @param {GeneratorFunction} genFunc The generator. 
 */
function Process(env, id, genFunc) {
    Event.apply(this, [ env, id ]);
    this._gen = genFunc();
    this._target = undefined;
    this._resumeCallback = this.resume.bind(this);
 
    // schedule an init event to startup this process.
    let initEvent = new Event(env, "initialize");
    this.bind(initEvent);
    env.schedule(initEvent, 0, Priority.URGENT);
}

Process.prototype = new Event();

/**
 * Interrupts the process.
 * 
 * @param {Error} cause The cause.
 */
Process.prototype.interrupt = function(cause) {
    new Interruption(this, cause);
}

/**
 * Binds the specific  event with the process.
 * 
 * @param {Event} event The event.
 */
Process.prototype.bind = function(event) {
    event.addCallback(this._resumeCallback);
}

/**
 * Unbinds the specific event with the process.
 * 
 * @param {Event} event The event.
 */
Process.prototype.unbind = function(event) {
    event.removeCallback(this._resumeCallback);
}

/**
 * Resumes to execute the next ONE event which the state is 'waiting'.
 * 
 * @param {Event} by The event resumes the process.
 */
Process.prototype.resume = function(by) {
    this.env().activeProcess(this);
    
    let event = by;
    let result = {
        done: false,
        value: undefined
    };
    while(!result.done) {
        if(!event.isOk()) {
            event.defused();
            result = event.failed(event.value());
        }
        else {
            result = this._gen.next(event.value());
        }

        if(!result.done) {
            event = result.value;
            // check if the event has been processed
            if(!event.isProcessed()) {
                result.value.addCallback(this._resumeCallback);
                break;
            }
        }
    }

    this._target = event;
    this.env().activeProcess(undefined);

    if(result.done) {
        this.succeed();
    }
}

export default Process;