const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// temporary storage (later DB use pannuvom)
let tasks = [];

// ✅ GET all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// ✅ ADD task
app.post("/tasks", (req, res) => {
    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    tasks.push(newTask);
    res.json(newTask);
});

// root route
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});