"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get("/", async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT * FROM applications WHERE user_id = $1", [req.userId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/", async (req, res) => {
    const { company, position, notes } = req.body;
    try {
        const result = await db_1.default.query("INSERT INTO applications (user_id, company, position, notes) VALUES ($1, $2, $3, $4) RETURNING *", [req.userId, company, position, notes]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const result = await db_1.default.query("DELETE FROM applications WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.patch("/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db_1.default.query("UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [status, req.params.id, req.userId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
