/**
 * @module Process
 *
 * @author Kyle K. Lin 
 */

import { Priority } from "./constants"
import Event from "./event"
import Interruption from "./interruption"

/**
 * The process event.
 * 
 * @constructor
 * @class
 * @extends Event
 * 
 * @param {Env} env The environment.
 * @param {string} id The process id. 
 * @param {GeneratorFunction} genFunc The generator function. 
 */
function Process(env, id, genFunc) {
    Event.apply(this, [ env, id ]);
    this._gen = genFunc();
    this._target = undefined; 
    this._resumeCallback = this.resume.bind(this);
 
    // schedule an init event to startup this process.
    let initEvent = new Event(env, "Init");
    this.bind(initEvent);
    env.schedule(initEvent, 0, Priority.URGENT);
}

Process.prototype = new Event();

/**
 * Interrupts this process.
 * 
 * @param {Error} cause The cause.
 */
Process.prototype.interrupt = function(cause) {
    new Interruption(this, cause);
}

/**
 * Binds the specific event with this process.
 * 
 * @param {Event} event The event.
 */
Process.prototype.bind = function(event) {
    event.addCallback(this._resumeCallback);
}

/**
 * Unbinds the specific event with this process.
 * 
 * @param {Event} event The event.
 */
Process.prototype.unbind = function(event) {
    event.removeCallback(this._resumeCallback);
}

/**
 * Resumes to execute the next __ONE__ event which the state is __'NOT PROCESS'__.
 * 
 * @param {Event} by The event resumes the process.
 */
Process.prototype.resume = function(by) {
    this.env().activeProcess(this);
    
    let event = by;
    // result from yield
    let result = {
        done: false,
        value: undefined
    };
    while(!result.done) {
        if(!event.isOk()) {
            event.defused();
            if(event.value() === undefined) {
                result = this._gen.throw(new Error("internal interrupt"));
            } else if(typeof event.value() === Error) {
                result = this._gen.throw(event.value());
            } else {
                result = this._gen.throw(new Error(event.value()));
            } 
        } else {
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