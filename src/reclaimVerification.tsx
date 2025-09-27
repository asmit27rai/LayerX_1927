import { useState } from "react";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

const BASE_URL = "https://brfw2w2m-3001.inc1.devtunnels.ms"; // if using ngrok, use the ngrok base url here

// Define a type for the proofs to handle different possible return types
// Using 'any' here since we don't have access to the exact Proof type from the SDK
type ProofData = any;

interface StartReclaimVerificationProps {
  onVerificationComplete?: () => void;
}

function StartReclaimVerification({
  onVerificationComplete,
}: StartReclaimVerificationProps) {
  const [proofs, setProofs] = useState<ProofData>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    try {
      setIsLoading(true);

      // Step 1: Fetch the configuration from your backend
      const response = await fetch(BASE_URL + "/generate-config");
      const { reclaimProofRequestConfig } = await response.json();
      console.log("hey, in handle");
      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      );

      // Step 3: Trigger the verification flow automatically
      // This method detects the user's platform and provides the optimal experience:
      // - Browser extension for desktop users (if installed)
      // - QR code modal for desktop users (fallback)
      // - Native app clips for mobile users
      await reclaimProofRequest.triggerReclaimFlow();

      // Step 4: Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          console.log("Successfully created proof", proofs);
          setProofs(proofs || null);
          setIsLoading(false);
          // Handle successful verification - proofs are also sent to your backend callback
          if (onVerificationComplete) {
            onVerificationComplete();
          }
        },
        onError: (error) => {
          console.error("Verification failed", error);
          setIsLoading(false);
          // Handle verification failure
        },
      });
      console.log("proofs state updated:", proofs);
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
      setIsLoading(false);
      // Handle initialization error (e.g., show error message)
    }
  };

  return (
    <>
      <button onClick={handleVerification} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Start Verification"}
      </button>

      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default StartReclaimVerification;
