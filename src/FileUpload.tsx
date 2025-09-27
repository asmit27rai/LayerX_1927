// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   useSearchParams,
//   useNavigate,
// } from "react-router-dom";
// import {
//   useCreateEntity,
//   useHypergraphApp,
//   useQuery,
//   useSpaces,
// } from "@graphprotocol/hypergraph-react";
// import { Event } from "./schema";

// function Login() {
//   const { redirectToConnect } = useHypergraphApp();
//   return (
//     <button
//       onClick={() =>
//         redirectToConnect({
//           storage: localStorage,
//           connectUrl: "https://connect.geobrowser.io/",
//           successUrl: `${window.location.origin}/authenticate-success`,
//           redirectFn: (url) => (window.location.href = url.toString()),
//         })
//       }
//     >
//       Authenticate with Connect
//     </button>
//   );
// }

// function RouteComponent() {
//   const [searchParams] = useSearchParams();
//   const ciphertext = searchParams.get("ciphertext");
//   const nonce = searchParams.get("nonce");
//   const { processConnectAuthSuccess } = useHypergraphApp();
//   const navigate = useNavigate();
//   const isProcessingRef = React.useRef(false);

//   useEffect(() => {
//     if (isProcessingRef.current) return;
//     if (!ciphertext || !nonce) {
//       console.warn("[Auth] Missing params");
//       return;
//     }

//     try {
//       processConnectAuthSuccess({
//         storage: localStorage,
//         ciphertext,
//         nonce,
//       });
//       isProcessingRef.current = true;
//       navigate("/", { replace: true });
//     } catch (error) {
//       alert(error instanceof Error ? error.message : String(error));
//     }
//   }, [ciphertext, nonce, processConnectAuthSuccess, navigate]);

//   return <div>Authenticating…</div>;
// }

// export default function App() {
//   const { data: privateSpaces, isPending: isSpacesPending } = useSpaces({
//     mode: "private",
//   });
//   const targetSpaceId = "0a469f84-ffde-4883-a7f0-18567a11b036";
//   const targetSpace = privateSpaces?.find((s) => s.id === targetSpaceId);
//   const isSpaceReady = !isSpacesPending && Boolean(targetSpace);

//   // State to track creation
//   const [eventsCreated, setEventsCreated] = useState(false);

//   // CreateEntity hook
//   const createEvent = useCreateEntity(Event, { space: targetSpaceId });

//   // Create three events once when space is ready
//   useEffect(() => {
//     if (!isSpaceReady || eventsCreated) return;

//     (async () => {
//       try {
//         await createEvent({ name: "Hello World1" });
//         await createEvent({ name: "Hello World2" });
//         await createEvent({ name: "Hello World3" });
//         setEventsCreated(true);
//       } catch (err) {
//         console.error("Create error:", err);
//         setEventsCreated(false);
//       }
//     })();
//   }, [isSpaceReady, createEvent, eventsCreated]);

//   // Query hook with subscription for live updates
//   const { data: eventsData, isPending: isQueryPending } = useQuery(Event, {
//     mode: "private",
//     space: targetSpaceId,
//     filter: {
//       name: {
//         is: "Hello World1",
//       }
//     }
//   });

//   return (
//     <BrowserRouter>
//       <div className="p-4">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route
//             path="/authenticate-success"
//             element={<RouteComponent />}
//           />
//         </Routes>

//         {isSpacesPending && <p>Loading spaces…</p>}

//         {!isSpacesPending && !isSpaceReady && (
//           <div>
//             <p>Space not found: {targetSpaceId}</p>
//             <p>
//               Available spaces:{" "}
//               {privateSpaces?.map((s) => s.name).join(", ") || "None"}
//             </p>
//           </div>
//         )}

//         {isSpaceReady && !eventsCreated && <p>Creating events…</p>}
//         {eventsCreated && <p>Events created!</p>}

//         {eventsCreated && (
//           <>
//             {isQueryPending && <p>Loading events…</p>}
//             {eventsData?.length > 0 && (
//               <div>
//                 <h2>Fetched Events:</h2>
//                 <ul>
//                   {eventsData.map((e) => (
//                     <li key={e.id}>{e.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </BrowserRouter>
//   );
// }

// import { useState } from "react";

// export default function FileUpload() {
//   const [files, setFiles] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [responses, setResponses] = useState([]);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const processFiles = (fileList) => {
//     const newFiles = Array.from(fileList);

//     newFiles.forEach((file) => {
//       if (file.type === "text/plain") {
//         const reader = new FileReader();
//         reader.onload = async (event) => {
//           const text = event.target.result;

//           try {
//             const res = await fetch("http://localhost:5500/encrypt", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ text, fileName: file.name }),
//             });

//             const data = await res.json();
//             setResponses((prev) => [...prev, { file: file.name, result: data }]);
//           } catch (err) {
//             console.error("Upload error:", err);
//           }
//         };
//         reader.readAsText(file);
//       } else {
//         console.warn("Only .txt files are supported.");
//       }
//     });

//     setFiles((prev) => [...prev, ...newFiles]);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       processFiles(e.dataTransfer.files);
//       e.dataTransfer.clearData();
//     }
//   };

//   const handleFileSelect = (e) => {
//     processFiles(e.target.files);
//   };

//   return (
//     <div className="container">
//       <h2>File Drag & Drop + Encrypt</h2>

//       <div
//         className={`dropzone ${dragActive ? "active" : ""}`}
//         onDragEnter={handleDrag}
//         onDragOver={handleDrag}
//         onDragLeave={handleDrag}
//         onDrop={handleDrop}
//         onClick={() => document.getElementById("fileInput").click()}
//       >
//         <p>{dragActive ? "Release to upload files" : "Drag & drop .txt files here"}</p>
//         <p>or click to browse</p>
//         <input
//           id="fileInput"
//           type="file"
//           multiple
//           accept=".txt"
//           onChange={handleFileSelect}
//           style={{ display: "none" }}
//         />
//       </div>

//       {files.length > 0 && (
//         <div className="file-list">
//           <h3>Files Added:</h3>
//           <ul>
//             {files.map((file, idx) => (
//               <li key={idx}>
//                 {file.name} ({Math.round(file.size / 1024)} KB)
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {responses.length > 0 && (
//         <div className="responses">
//           <h3>Server Responses:</h3>
//           <ul>
//             {responses.map((res, idx) => (
//               <li key={idx}>
//                 <strong>{res.file}:</strong>{" "}
//                 {res.result?.data?.Hash
//                   ? `Uploaded → CID: ${res.result.data.Hash}`
//                   : `Error: ${res.result?.error || "Unknown error"}`}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import StartReclaimVerification from "./reclaimVerification";

type ResponseItem = { file: string; result: any };

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [signMessage, setSignMessage] = useState("");
  const [showReclaimVerification, setShowReclaimVerification] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected to MetaMask account:", accounts[0]);
        const currentAccount = accounts[0];
        if (!currentAccount) {
          throw new Error("No account found after connecting to MetaMask.");
        }
        const authMessage = await lighthouse.getAuthMessage(currentAccount);

        // ask MetaMask to sign it
        const signedMessage = await window.ethereum.request({
          method: "personal_sign",
          params: [authMessage.data.message, currentAccount],
        });
        console.log("Signed Message:", signedMessage);
        setSignMessage(signedMessage);
      } catch (error) {
        const errorMsg = (error instanceof Error) ? error.message : String(error);
        console.error("Error connecting to MetaMask:", errorMsg);
        alert(`Error connecting to MetaMask: ${errorMsg}`);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask!");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFilesAfterVerification = (fileList: FileList) => {
    const newFiles = Array.from(fileList);

    newFiles.forEach((file) => {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result;

          try {
            const res = await fetch("https://brfw2w2m-5500.inc1.devtunnels.ms/encrypt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text, fileName: file.name, pubKey: account, signMess: signMessage }),
            });

            const data = await res.json();
            setResponses((prev) => [...prev, { file: file.name, result: data }]);
          } catch (err) {
            console.error("Upload error:", err);
          }
        };
        reader.readAsText(file);
      } else {
        console.warn("Only .txt files are supported.");
      }
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const processFiles = (fileList: FileList) => {
    // Store the files to be processed after verification
    setPendingFiles(fileList);
    // Trigger Reclaim verification first
    setShowReclaimVerification(true);
  };

  const handleVerificationComplete = () => {
    // After verification is complete, process the pending files
    if (pendingFiles) {
      processFilesAfterVerification(pendingFiles);
      setPendingFiles(null);
    }
    setShowReclaimVerification(false);
  };

  const handleSkipVerification = () => {
    // Skip verification and process files directly
    if (pendingFiles) {
      processFilesAfterVerification(pendingFiles);
      setPendingFiles(null);
    }
    setShowReclaimVerification(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>File Drag & Drop + Encrypt</h2>

      <button onClick={connectToMetaMask}>Connect Wallet</button>

      {showReclaimVerification ? (
        <div style={styles.verificationContainer}>
          <h3>Please complete verification before uploading files</h3>
          <StartReclaimVerification onVerificationComplete={handleVerificationComplete} />
          <div style={styles.buttonContainer}>
            <button 
              onClick={handleSkipVerification}
              style={styles.skipButton}
            >
              Skip verification for now
            </button>
            <button 
              onClick={() => setShowReclaimVerification(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{ ...styles.dropzone, ...(dragActive ? styles.activeDropzone : {}) }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p style={styles.dropText}>
            {dragActive ? "Release to upload files" : "Drag & drop .txt files here"}
          </p>
          <p style={styles.dropSubText}>or click to browse</p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      )}

      {files.length > 0 && (
        <div style={styles.fileList}>
          <h3>Files Added:</h3>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {responses.length > 0 && (
        <div style={styles.responses}>
          <h3>Server Responses:</h3>
          <ul>
            {responses.map((res, idx) => (
              <li key={idx}>
                <strong>{res.file}:</strong>{" "}
                {res.result?.data?.Hash
                  ? `Uploaded → CID: ${res.result.data.Hash}`
                  : `Error: ${res.result?.error || "Unknown error"}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  },
  dropzone: {
    border: "2px dashed #4f46e5",
    padding: "50px",
    textAlign: "center",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeDropzone: {
    backgroundColor: "#eef2ff",
    borderColor: "#3730a3",
  },
  dropText: {
    fontSize: "18px",
    color: "#4f46e5",
    marginBottom: "8px",
  },
  dropSubText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  fileList: {
    marginTop: "30px",
    backgroundColor: "#eef2ff",
    padding: "20px",
    borderRadius: "8px",
  },
  responses: {
    marginTop: "20px",
    backgroundColor: "#f0fdf4",
    padding: "20px",
    borderRadius: "8px",
  },
  verificationContainer: {
    marginTop: "30px",
    marginBottom: "30px",
    padding: "30px",
    backgroundColor: "#fff3cd",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #ffeaa7",
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  skipButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
};