const { Worker, isMainThread } = require("worker_threads");

console.log("this is the main thread");
// for (let i = 0; i < 1000000000; i++) console.log("hello 123", i * i);

new Worker("./checkout.js", { workerData: { delay: 10 } });
new Worker("./checkout.js", { workerData: { delay: 5 } });
