import server from ".";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/movie-app")
  .then((result) => {
    if (result) {
      void server.listen(8001, () => {
        console.log("Server is running on port 8001");
      });
      return { connectionStatus: true };
    }
  })
  .then((status) => {
    console.log(`connection status is ${status?.connectionStatus}`);
  })
  .catch((exception) => {
    console.error(exception);
  });
