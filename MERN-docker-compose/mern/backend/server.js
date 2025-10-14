import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

// ✅ CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",             // for local React dev
    "http://204.236.209.251:3000",       // for remote React dev
    "https://your-frontend-domain.com"   // for production build (replace with actual)
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // include PATCH + OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Mount routes
app.use("/record", records);

// ✅ Optional: simple health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running ✅" });
});

// ✅ Start server and listen on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
