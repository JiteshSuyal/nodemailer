const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require("cors");

// Environment Path
require("dotenv");

// Routes
const userRoute = require("./src/route/user.route");

// // Environment Variable
// const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Calling Routes
app.use("/user", userRoute);

//Restrict Invalid Routes
app.use((req, res) => {
  console.log("Invalid Page Request");
  res
    .send(
      "<h1><i><strong> ( 404 ) Page Not Found , Invalid page request</i></h1>"
    )
    .status(400);
});

/**========================================================================
 *                           Listening Port at 5000
 *========================================================================**/
// app.listen(port, () => {
//   console.log(`server is starting on port ${port}`);
// });

module.exports.handler = serverless(app);
