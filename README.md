UIA-SIM for JavaScript, DESim4JS
===

DESim4JS is a JavaScript port of SimPy, process-based discrete event simulation framework.

DESim4JS aims to port the concepts used in SimPy to the JavaScript world.

A simple example:
```js
var env = new desim.Env(); 
var bell = env.event("bell");
env.process("John", function *() {
    while(true) {
        let state = yield bell;
        if(state === "end") {
            console.log("\\o/");
        } else {
            console.log("|o|");
        }
    }
});
env.process("School", function *() {
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
```
