const server = require("./server.js");

const port = 5000;
server.listen(port, () =>
  console.log(`\n***server is running on port ${port}***\n`)
);
