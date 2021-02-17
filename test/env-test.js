var tape = require("tape"),
    desim = require("../");

tape("Env simple", function(test) {
    var env = new desim.Env(); 
    env.process("p1", function *() {
        yield env.timeout("p1t1", 10);
        test.equal(env.now(), 10, "p1 time 10");
        yield env.timeout("p1t2", 20);
        test.equal(env.now(), 30, "p1 time 30");
    });
    env.process("p2", function *() {
        yield env.timeout("p2t1", 15);
        test.equal(env.now(), 15, "p2 time 15");
        yield env.timeout("p2t2", 25);
        test.equal(env.now(), 40, "p2 time 40");
    });
    env.run();
    test.end();
});
      
tape("Env with until", function(test) {
    var env = new desim.Env(); 
    env.process("p1", function *() {
        yield env.timeout("t10", 10);
        test.equal(env.now(), 10, "p1 time 10");
        yield env.timeout("t20", 20);
        test.true(false, "p1 time 30");
    });
    env.run(30);
    test.end();
});

tape("Env school", function(test) {
    var env = new desim.Env(); 
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
