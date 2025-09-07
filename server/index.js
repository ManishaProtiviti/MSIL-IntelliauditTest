// server.js
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import {startConsumer} from './configs/msmq/consumer.js'
import { Environment } from "./constants.js";
const PORT = Environment.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
startConsumer();
