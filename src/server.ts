import mongoose from "mongoose";

import app from "./App";
import db from "./database/config";

console.log(db.uri);

mongoose
  .connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server started on port ${process.env.PORT || 3000}!`);
});
