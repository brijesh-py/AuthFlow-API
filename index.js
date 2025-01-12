require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
