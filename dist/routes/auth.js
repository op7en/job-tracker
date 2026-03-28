"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const result = await db_1.default.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hashed]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db_1.default.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = result.rows[0];
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user: { id: user.id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
