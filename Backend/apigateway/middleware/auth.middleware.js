import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            // console.log("[API Gateway Auth] No sessionId cookie found in request.");
            return res.status(401).json({
                message: "Unauthorized: No session cookie"
            });
        }

        const redisKey = `session-${sessionId}`;
        const session = await redis.get(redisKey);
        // console.log(`[API Gateway Auth] Looking up Redis Key: "${redisKey}" -> Found:`, session ? "VALID SESSION" : "NULL (Expired/Invalid)");

        if (!session) {
            return res.status(401).json({
                message: "Session Expired or Invalid"
            });
        }
        req.user = JSON.parse(session);
        next();
    } catch (err) {
        console.error("Middleware error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default protect;