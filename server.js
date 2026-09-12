const express = require("express");
const path = require("path");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve website files
app.use(express.static(path.join(__dirname, "public")));

// Main route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "FlexCore Technologies"
    });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(
        `FlexCore Technologies running on ${HOST}:${PORT}`
    );
});
