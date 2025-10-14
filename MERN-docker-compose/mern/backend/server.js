import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://204.236.209.251:3000",
    "https://your-frontend-domain.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/record", records);

// Start the Express server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
