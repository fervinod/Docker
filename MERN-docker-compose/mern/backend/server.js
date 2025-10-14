import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
