var tape = require("tape"),
    desim = require("../");

tape("Timeout simple", function(test) {
    var env = new desim.Env(); 

    var timeout1 = new desim.Timeout(env, "timeout1", 0);
    test.equal(timeout1.id(), "timeout1", "timeout1 create");
    test.equal(timeout1.isTriggered(), true, "timeout1 triggered");
    test.equal(timeout1.isProcessed(), false, "timeout1 not processed");

    var timeout2 = new desim.Timeout(env, "timeout2", 0, "12");
    test.equal(timeout2.id(), "timeout2", "timeout2 create");
    test.equal(timeout1.isTriggered(), true, "timeout2 triggered");
    test.equal(timeout1.isProcessed(), false, "timeout2 not processed");
    test.equal(timeout2.value(), "12", "timeout2 value is 12");

    test.end();
});
