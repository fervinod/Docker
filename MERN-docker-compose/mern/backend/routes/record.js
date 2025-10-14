import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * ✅ All routes use .status().json() instead of .send().status()
 * ✅ Removed any 204 responses (they strip headers, including CORS)
 * ✅ Added consistent try/catch error handling
 * ✅ Fully compatible with your fixed server.js CORS setup
 */

// Get all records
router.get("/", async (req, res) => {
  try {
    const collection = db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ message: "Error fetching records" });
  }
});

// Get one record by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({ message: "Error fetching record" });
  }
});

// Create a new record
router.post("/", async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };

    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);

    // ✅ Use 201 (Created), not 204
    res.status(201).json({
      message: "Record created successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).json({ message: "Error adding record" });
  }
});

// Update a record
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record updated successfully" });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ message: "Error updating record" });
  }
});

// Delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ message: "Error deleting record" });
  }
});

export default router;
