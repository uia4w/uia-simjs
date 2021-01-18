var tape = require("tape"),
desim = require("../dist/desim");

tape("RealtimeEnv school", function(test) {
    var env = new desim.RealtimeEnv(); 
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
