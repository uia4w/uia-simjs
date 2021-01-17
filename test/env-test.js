var tape = require("tape"),
    simjs = require("../");

tape("Env simple", function(test) {
    var env = new simjs.Env(); 
    env.process("p1", function *() {
        yield env.timeout("p1t1", 10);
        test.equal(env.now(), 10);
        yield env.timeout("p1t2", 10);
        test.equal(env.now(), 20);
    });
    env.process("p2", function *() {
        yield env.timeout("p2t1", 15);
        test.equal(env.now(), 15);
        yield env.timeout("p2t2", 25);
        test.equal(env.now(), 40);
    });
    env.run();
    test.end();
});
      
tape("Env with until", function(test) {
    var env = new simjs.Env(); 
    env.process("p1", function *() {
        yield env.timeout("t10", 10);
        test.equal(env.now(), 10);
        yield env.timeout("t20", 20);
        test.true(false);
    });
    env.run(30);
    test.end();
});

tape("Env school", function(test) {
    var env = new simjs.Env(); 
    var bell = env.event("bell");
    env.process("john", function *() {
        while(true) {
            let state = yield bell;
            if(state === "end") {
                console.log("john:\\o/, time:" + env.now());
            } else {
                console.log("john:|o|, time:" + env.now());
            }
        }
    });
    env.process("school", function *() {
        while(true) {
            yield env.timeout("in", 40);
            bell.succeed("end");
            bell = env.event("bell");

            yield env.timeout("out", 10);
            bell.succeed("begin");
            bell = env.event("bell");
        }
    });

    env.run(250);
    test.end();
});
