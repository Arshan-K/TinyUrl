const cors = require("cors");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request origin:", origin);
    const cleanOrigin = origin?.replace(/\/$/, "");
    if (!origin || allowedOrigins.includes(cleanOrigin)) return callback(null, true);
    callback(new Error("Not allowed by CORS: " + origin));
    },
  credentials: true,
};

module.exports = cors(corsOptions);
