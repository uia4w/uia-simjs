/**
 * @module RealtimeEnv
 *
 * @author Kyle K. Lin 
 */

import Env from "./env";
import Event from "./event";

/**
 * The realtime simulation environment.
 * 
 * @constructor
 * @class
 * @extends Env
 * @param {number} tickSize The tick size. Default is 20ms.
 */
function RealtimeEnv(tickSize = 20) {
    Env.apply(this, []);
    this._tickSize = tickSize;
    this._pause = false;
    this._pauseGen = undefined;
} 

RealtimeEnv.prototype = new Env();

RealtimeEnv.prototype.pause = async function(timeout = 0) {
    this._pause = true;
    if(timeout > 0) {
        console.log("pause");
        await delay(timeout);
        console.log("resume");
        this.resume();
    }
}

RealtimeEnv.prototype.resume = function() {
    this._pause = false;
    if(this._pauseGen) {
        this._pauseGen.next();
        this._pauseGen = undefined;
    }
}

/**
 * Runs the realtime environment. The method is async.
 * 
 * @param {number} until The end time.
 */
RealtimeEnv.prototype.run = async function(until = 0) {
    console.log("=== realtime start ===");
    try {
        if(until > 0) {
            let stopEvent = new Event(this, "StopSim");
            stopEvent.addCallback(function() {
                throw new Error("time up interruption");
            });
            this.schedule(stopEvent, until, this._now);
        }

        while(this.queue().length !== 0 && (until <= 0 || this._now < until)) {
            let job = this.queue().peek();
            let ms = job.time - this.now();
            if(ms > 0) {
                await delay(ms * this._tickSize);
            }
            if(this._pause) {
                this._pauseGen = function *() {
                    yield true;
                    this._pause = false;
                    this._pauseGen = undefined;
                    this.step();
                }();
            } else {
                this.step();
            }
        }
        console.log("=== realtime end ===");
    } catch(err) {
        console.log(err.message);
        console.log("=== realtime end  realtime with exception ===");
    }
}

function delay(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);     
    });
}

export default RealtimeEnv;


