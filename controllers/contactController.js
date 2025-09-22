// controllers/contactController.js
import Contact from "./src/models/contactModel.js";

export const submitContactForm = async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ fullname, email, message });
    await newContact.save();

    res.status(201).json({
      message: "Message sent successfully!",
      contact: newContact,
    });
  } catch (error) {
    console.error("❌ Error in submitContactForm:", error);
    res.status(500).json({ error: "Server error" });
  }
};
