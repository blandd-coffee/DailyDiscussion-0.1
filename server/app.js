/*
________         .__.__          ________  .__                                  .__               
\______ \ _____  |__|  | ___.__. \______ \ |__| ______ ____  __ __  ______ _____|__| ____   ____  
 |    |  \\__  \ |  |  |<   |  |  |    |  \|  |/  ___// ___\|  |  \/  ___//  ___/  |/  _ \ /    \ 
 |    `   \/ __ \|  |  |_\___  |  |    `   \  |\___ \\  \___|  |  /\___ \ \___ \|  (  <_> )   |  \
/_______  (____  /__|____/ ____| /_______  /__/____  >\___  >____//____  >____  >__|\____/|___|  /
        \/     \/        \/              \/        \/     \/           \/     \/               \/ 
*/

import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import session from "express-session";
import cors from "cors";

import userRoutes from "./src/routes/user.routes.js";
import discussionRoutes from "./src/routes/discussion.routes.js";
import responseRoutes from "./src/routes/response.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import requireAuth from "./src/middleware/auth.js";
import { CreateAdminAuth } from "./src/middleware/isAdmin.js";
//import requestOnly from "./src/middleware/noAPI.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; //TODO: make this 8080 (fix the reroute on msal)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

//Express config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Auth routes and middleware
app.use("/auth", authRoutes);
app.use(requireAuth);
//app.use(requestOnly);

// Default routes

//API ROutes
app.use("/api/discussions", discussionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/responses", responseRoutes);

//Admin only
app.get("/", CreateAdminAuth(__dirname), (req, res) => {
  console.log("reached");
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
