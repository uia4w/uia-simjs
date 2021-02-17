import Condition from "./condition";

function AllOf(env, id, events) {
    Condition.apply(this, [ env, id, events ]);
}

AllOf.prototype = new Condition();

AllOf.prototype.evaluate = function(events) {
    return events.find(e => !e.isProcessed()) === undefined;
} 

export default AllOf;