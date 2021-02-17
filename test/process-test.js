var tape = require("tape"),
    desim = require("../");

tape("process simple", function(test) {
    var env = new desim.Env(); 

    env.process("p1", function *() {
        yield env.timeout("t1", 10);
        test.equal(env.now(), 10, "timeout 10");
        yield env.timeout("t1", 20);
        test.equal(env.now(), 30, "timeout 20");
        yield env.timeout("t1", 30);
        test.equal(env.now(), 60, "timeout 30");
    });
    env.run();

    test.end();
});

tape("process interaction", function(test) {
    let env = new desim.Env(); 

    let p1 = env.process("p1", function *() {
        yield env.timeout("t1", 10);
        test.equal(env.now(), 10, "p1 timeout 10");
        yield env.timeout("t1", 20);
    });
    env.process("p2", function *() {
        yield p1;
        test.equal(env.now(), 30, "p2 after p1");
    });
    env.run();

    test.end();
});

tape("process interrupt", function(test) {
    var env = new desim.Env(); 

    let p1 = env.process("p1", function *() {
        try {
            yield env.timeout("t1", 20);
            test.true(false, "p1 interrupted failed");
        } catch(e) {
            test.equal(e.message, "Error: p2 interrupts p1", "p1 interrupted");
        }
        yield env.timeout("t1", 20);
        test.equal(env.now(), 30, "p1 timeout 20");
    });
    env.process("p2", function *() {
        yield env.timeout("t1", 10);
        p1.interrupt(new Error("p2 interrupts p1"));
    });
    env.run();

    test.end();
});
