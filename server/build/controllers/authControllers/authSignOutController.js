"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authSignOutController = (req, res) => {
    try {
        res
            .clearCookie("jwt", { httpOnly: true, secure: false })
            .status(200)
            .json({ message: "Logout Success" });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.default = authSignOutController;
