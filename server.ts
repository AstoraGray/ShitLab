import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateMasterpieceArtProgrammatically } from "./src/utils/synthesisEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Complete express backend setup containing ZERO AI packages, purely programmatic synthesis and high-coverage static assets rules
app.post("/api/synthesize", (req, res) => {
  try {
    const { meals, holdingDays, artistName, heldMealsHistory } = req.body;
    
    if (!meals) {
      return res.status(400).json({ error: "Missing meals input" });
    }

    const compiledArt = generateMasterpieceArtProgrammatically(
      meals,
      Number(holdingDays || 0),
      heldMealsHistory || [],
      artistName || "momo"
    );

    return res.json(compiledArt);
  } catch (error: any) {
    console.error("Critical: Algorithmic synthesis pipeline error:", error);
    return res.status(500).json({ error: "Algorithmic synthesis pipeline failed gracefully" });
  }
});

// Setup Vite & Server routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
