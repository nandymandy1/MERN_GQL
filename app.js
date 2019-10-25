const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const isAuth = require("./middleware/isAuth");
const graphqlHttp = require("express-graphql");
const graphQLSchema = require("./graphql/schema");
const graphQLResolver = require("./graphql/resolver");

const app = express();
const PORT = process.env.PORT || 3000;
const { db } = require("./config/db");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to the database successfully \n${db}`))
  .catch(err => console.log(`Unable to connect with the database \n${err}`));

app.use(bodyParser.json());
app.use(cors());
app.use(isAuth);
app.use(
  `/api/backend`,
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true
  })
);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
