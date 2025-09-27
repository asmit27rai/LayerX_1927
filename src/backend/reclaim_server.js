import express from "express";
import { ReclaimProofRequest, verifyProof } from "@reclaimprotocol/js-sdk";

const app = express();
const port = 3001;

// Add CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.text({ type: "*/*", limit: "50mb" })); // This is to parse the urlencoded proof object that is returned to the callback url

const BASE_URL = "https://brfw2w2m-3001.inc1.devtunnels.ms"; // if using ngrok, provide the ngrok base url

// Route to generate SDK configuration
app.get("/generate-config", async (req, res) => {
  const APP_ID = "0xAD850aDc001C6140d2926E57FbbEDa48C07F936d";
  const APP_SECRET =
    "0x2ce66054059f8a05555be79877577611662ec602ebc106f5bb1f25668f073ee4";
  const PROVIDER_ID = "81dd6dc5-b50d-4276-b4cb-dc67bdcf919f";

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    // we will be defining this endpoint in the next step
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + "/receive-proofs");

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error("Error generating request config:", error);
    return res.status(500).json({ error: "Failed to generate request config" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Route to receive proofs
app.post("/receive-proofs", async (req, res) => {
  // decode the urlencoded proof object; see below if not using express middlewares for decoding
  const decodedBody = decodeURIComponent(req.body);
  const proof = JSON.parse(decodedBody);

  // Verify the proof using the SDK verifyProof function
  const result = await verifyProof(proof);
  if (!result) {
    return res.status(400).json({ error: "Invalid proofs data" });
  }

  console.log("Received proofs:", proof);
  // Process the proofs here
  return res.sendStatus(200);
});
