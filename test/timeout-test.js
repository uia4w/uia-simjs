var tape = require("tape"),
    desim = require("../");

tape("Timeout simple", function(test) {
    var env = new desim.Env(); 

    var timeout1 = new desim.Timeout(env, "timeout1", 0);
    test.equal(timeout1.id(), "timeout1");
    test.equal(timeout1.isTriggered(), true);
    test.equal(timeout1.isProcessed(), false);

    var timeout2 = new desim.Timeout(env, "timeout2", 0, "12");
    test.equal(timeout2.id(), "timeout2");
    test.equal(timeout2.isTriggered(), true);
    test.equal(timeout2.isProcessed(), false);
    test.equal(timeout2.value(), "12");

    test.end();
});
