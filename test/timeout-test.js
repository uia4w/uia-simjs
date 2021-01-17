var tape = require("tape"),
    simjs = require("../");

tape("Timeout simple", function(test) {
    var env = new simjs.Env(); 

    var timeout1 = new simjs.Timeout(env, "timeout1", 0);
    test.equal(timeout1.id(), "timeout1");
    test.equal(timeout1.isTriggered(), true);
    test.equal(timeout1.isProcessed(), false);

    var timeout2 = new simjs.Timeout(env, "timeout2", 0, "12");
    test.equal(timeout2.id(), "timeout2");
    test.equal(timeout2.isTriggered(), true);
    test.equal(timeout2.isProcessed(), false);
    test.equal(timeout2.value(), "12");

    test.end();
});
