import mongoose from "mongoose";

const configOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDb = async () => {
  const connectionUrl =
    "mongodb+srv://hoangphuong291199:bachuga123@cluster0.ztibcek.mongodb.net/";

  mongoose
    .connect(connectionUrl, configOption)
    .then(() => console.log("Ecommerce db connected successfully"))
    .catch((err) =>
      console.log(`geeting error from db connection ${err.message}`)
    );
};

export default connectToDb;
