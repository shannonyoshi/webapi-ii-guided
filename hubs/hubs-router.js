const express = require("express");
const Hubs = require("./hubs-model.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving the hubs"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hub = await Hubs.findById(req.params.id);

    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "Hub not found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hub"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error adding the hub"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The hub has been nuked" });
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error removing the hub"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error updating the hub"
    });
  }
});

// add an endpoint that returns all the messages for a hub

couter.get("/:id/messages", async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Hubs.findHubMessages(id);
    if (messages && messages.length) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ message: "These messages could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error locating messages"
    });
  }
});

router.post("/:id/messages", async (req, res) => {
  if (!isValidMessage(req.body)) {
    res.status(400).json({ errorMessage: "Must include sender and text" });
  } else {
    try {
      const message = await Hubs.addMessage(req.body);
      res.status(201).json(message);
    } catch {
      res
        .status(500)
        .json({ message: "There was an error adding this message" });
    }
  }
});

function isValidMessage(message) {
  const { sender, text, hub_id } = message;
  return sender && text && hub_id;
}

// add an endpoint for adding new message to a hub

// messages should have text & hub_id

module.exports = router;
