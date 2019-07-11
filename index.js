const dotenv = require("dotenv");
dotenv.config();

const server = require("./server.js");

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n***server is running on http://localhost:${port} ***\n`)
);
