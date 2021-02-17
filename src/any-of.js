import Condition from "./condition";

function AnyOf(env, id, events) {
    Condition.apply(this, [ env, id, events ]);
}

AnyOf.prototype = new Condition();

AnyOf.prototype.evaluate = function(events) {
    return events.find(e => e.isProcessed()) !== undefined;
} 

export default AnyOf;