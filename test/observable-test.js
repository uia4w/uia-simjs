var tape = require("tape"),
desim = require("../dist/desim");

tape("Observable many2one", function(test) {
    var env = new desim.Env(); 

    var obv = new desim.Observable(env, "sources");

    var p1 = env.process("source1", function *() {
        yield env.timeout("t1", 100);
        obv.available(p1);
        yield env.timeout("t2", 100);
        obv.available(p1);
    });
    var p2 = env.process("source2", function *() {
        yield env.timeout("t3", 150);
        obv.available(p2);
    });

    env.process("target", function *() {
        var a1 = yield obv.ask();
        test.equal(a1.id(), "source1", "source1 available");
        test.equal(env.now(), 100, "source1 time 100");

        var a2 = yield obv.ask();
        test.equal(a2.id(), "source2", "source2 available");
        test.equal(env.now(), 150, "source2 time 150");

        var a3 = yield obv.ask();
        test.equal(a3.id(), "source1", "source1 available");
        test.equal(env.now(), 200, "source1 time 200");
    });
    env.run();
    test.end();
});

tape("Observable one2many", function(test) {
    var env = new desim.Env(); 

    var obv = new desim.Observable(env, "sources");

    var p1 = env.process("source1", function *() {
        yield env.timeout("t1", 100);
        obv.available(p1);
        yield env.timeout("t2", 100);
        obv.available(p1);
        yield env.timeout("t2", 100);
        obv.available(p1);
    });

    env.process("target1", function *() {
        yield obv.ask();
        test.equal(env.now(), 100, "target1 time 100");
        yield env.timeout("t4", 50);

        yield obv.ask();
        test.equal(env.now(), 200, "target1 time 200");
    });

    env.process("target2", function *() {
        yield obv.ask();
        test.equal(env.now(), 100, "target2 time 100");
        yield env.timeout("t5", 150);

        yield obv.ask();
        test.equal(env.now(), 300, "target2 time 300");
    });

    env.run();
    test.end();
});
