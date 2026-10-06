import express from "express";
import Thread from "../models/thread.js";
import { getResponse } from "../utils/openrouter.js";
const router = express.Router();

// Test Route
router.post("/test", async (req, res) => {
    try {
        let thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });

        const response = await thread.save();

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to save in DB"
        });
    }
});

//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });

        //descending order of updatedAt...most recent data on top

        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed  to fetch threads" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try{
        const thread = await Thread.findOne({ threadId });

        if(!thread){
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try{
        const thread = await Thread.findOneAndDelete({ threadId });

        if(!thread){
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ message: "Thread deleted successfully" });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Add a new message to a thread and get response from OpenAI
router.post("/chat", async (req, res) => {

    

    const { threadId, message } = req.body;

    

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    try {

        let thread = await Thread.findOne({ threadId });

        if (!thread) {

            thread = new Thread({
                threadId,
                title: message,
                messages: [{
                        role: "user",
                        content: message
                }]
            });

        } else {

            thread.messages.push({
                role: "user",
                content: message
            });

        }

        const assistantReply = await getResponse(message);

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        res.json({
            message: assistantReply
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to add message to thread"
        });

    }

});


export default router;