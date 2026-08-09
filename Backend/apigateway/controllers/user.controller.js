


export const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        console.error("Error fetching current user:", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

