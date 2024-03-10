import mongoose from "mongoose";

function connectToDB(): void {
  let uri: string | null;

  if (process.env.DB_USER) {
    uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.${process.env.DB_NAME}.mongodb.net/`;
  }

  if (uri) {
    mongoose
      .connect(uri)
      .then(() => {
        console.log("Connected to Database");
      })
      .catch((err) => {
        throw err;
      });
  }
}

export { connectToDB };
