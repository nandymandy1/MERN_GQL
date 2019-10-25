module.exports = {
  db:
    process.env.NODE_ENV === "production"
      ? "production mongodb URI"
      : "mongodb://localhost:27017/mern-gql",
  appkey:
    process.env.NODE_ENV === "production" ? "production key" : "development_key"
};
