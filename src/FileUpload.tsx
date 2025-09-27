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
import Web3 from "web3";

// DataCoin ABI - same as your ethers implementation
const DataCoinABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintingPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
import StartReclaimVerification from "./reclaimVerification";

type ResponseItem = { file: string; result: any };

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [signMessage, setSignMessage] = useState("");
  const [userBalance, setUserBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");

  // // DataCoin contract configuration
  // const dataCoinAddress = "0xa14159C1B383fBCa4A9C197aFC83E01DB4655B24";
  // const dataCoinABI = [
  //   {
  //     inputs: [
  //       {
  //         internalType: "address",
  //         name: "to",
  //         type: "address",
  //       },
  //       {
  //         internalType: "uint256",
  //         name: "amount",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "mintTokens",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ];

  // Function to fetch and log DaoCoin information
  const fetchDaoCoinInfo = async (userAddress: string) => {
    console.log(
      "\n🪙 [DATACOIN INFO] ==========================================="
    );
    console.log("🪙 [DATACOIN INFO] Fetching DataCoin information...");
    console.log("🪙 [DATACOIN INFO] User Address:", userAddress);

    try {
      // Setup Web3 connection (reusing the same logic as mint function)
      const sepoliaRPCs = [
        "https://ethereum-sepolia.publicnode.com",
        "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        "https://rpc.sepolia.ethpandaops.io",
        "https://1rpc.io/sepolia",
      ];

      let web3;
      let workingRPC = null;

      for (const rpc of sepoliaRPCs) {
        try {
          const testWeb3 = new Web3(rpc);
          await testWeb3.eth.getBlockNumber();
          web3 = testWeb3;
          workingRPC = rpc;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!web3 || !workingRPC) {
        throw new Error("Failed to connect to any Sepolia RPC endpoint");
      }

      const dataCoinAddress = "0xa14159C1B383fBCa4A9C197aFC83E01DB4655B24";
      const contract = new web3.eth.Contract(DataCoinABI, dataCoinAddress);

      console.log("🪙 [DATACOIN INFO] Connected to RPC:", workingRPC);
      console.log("🪙 [DATACOIN INFO] Contract Address:", dataCoinAddress);

      // Fetch token basic information
      const [name, symbol, totalSupply, userBalance] = await Promise.all([
        contract.methods.name().call() as Promise<string>,
        contract.methods.symbol().call() as Promise<string>,
        contract.methods.totalSupply().call() as Promise<string>,
        contract.methods.balanceOf(userAddress).call() as Promise<string>,
      ]);

      // Convert from wei to readable format
      const totalSupplyFormatted = web3.utils.fromWei(
        totalSupply.toString(),
        "ether"
      );
      const userBalanceFormatted = web3.utils.fromWei(
        userBalance.toString(),
        "ether"
      );

      // Update state
      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(totalSupplyFormatted);
      setUserBalance(userBalanceFormatted);

      // Console logs with beautiful formatting
      console.log("\n🎯 [DATACOIN INFO] TOKEN INFORMATION:");
      console.log("📛 [DATACOIN INFO] Token Name:", name);
      console.log("🏷️ [DATACOIN INFO] Token Symbol:", symbol);
      console.log("📊 [DATACOIN INFO] Contract Address:", dataCoinAddress);

      console.log("\n💰 [DATACOIN INFO] SUPPLY & BALANCE:");
      console.log(
        "🌍 [DATACOIN INFO] Total Supply (Mined):",
        totalSupplyFormatted,
        symbol
      );
      console.log(
        "👤 [DATACOIN INFO] Your Balance:",
        userBalanceFormatted,
        symbol
      );
      console.log(
        "📈 [DATACOIN INFO] Your Balance (Raw Wei):",
        userBalance.toString()
      );
      console.log(
        "🌐 [DATACOIN INFO] Total Supply (Raw Wei):",
        totalSupply.toString()
      );

      console.log("\n📊 [DATACOIN INFO] STATISTICS:");
      const balancePercentage =
        BigInt(totalSupply) > 0
          ? (BigInt(userBalance) * BigInt(10000)) /
            BigInt(totalSupply) /
            BigInt(100)
          : BigInt(0);
      console.log(
        "📊 [DATACOIN INFO] Your Share of Total Supply:",
        balancePercentage.toString() + "%"
      );
      console.log(
        "🪙 [DATACOIN INFO] ==========================================="
      );

      return {
        name,
        symbol,
        totalSupply: totalSupplyFormatted,
        userBalance: userBalanceFormatted,
        contractAddress: dataCoinAddress,
      };
    } catch (error) {
      console.error("❌ [DATACOIN INFO] Error fetching DataCoin info:", error);
      return null;
    }
  };

  // Function to mint tokens after successful file upload using private key
  const mintTokensToUser = async (
    userAddress: string,
    tokenAmount: number = 10
  ) => {
    console.log("🚀 [MINT DEBUG] Starting mint process...");
    console.log("🔍 [MINT DEBUG] Target address:", userAddress);
    console.log("🔍 [MINT DEBUG] Token amount:", tokenAmount);

    try {
      // Get private key from environment variables
      console.log("🔍 [MINT DEBUG] Checking for private key...");
      const privateKey = import.meta.env.VITE_PRIVATE_KEY;
      if (!privateKey) {
        console.error(
          "❌ [MINT DEBUG] Private key not found in environment variables"
        );
        throw new Error("Private key not found in environment variables");
      }
      console.log(
        "✅ [MINT DEBUG] Private key found (length:",
        privateKey.length,
        ")"
      );

      // Setup Web3 with Sepolia RPC
      console.log("🔍 [MINT DEBUG] Setting up Web3 connection to Sepolia...");

      // Try multiple Sepolia RPC endpoints for redundancy
      const sepoliaRPCs = [
        "https://ethereum-sepolia.publicnode.com",
        "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Public Infura endpoint
        "https://rpc.sepolia.ethpandaops.io",
        "https://1rpc.io/sepolia", // Original endpoint as fallback
      ];

      let web3;
      let workingRPC = null;

      for (const rpc of sepoliaRPCs) {
        try {
          console.log("🔍 [MINT DEBUG] Trying RPC:", rpc);
          const testWeb3 = new Web3(rpc);

          // Test the connection by trying to get the latest block number
          await testWeb3.eth.getBlockNumber();

          web3 = testWeb3;
          workingRPC = rpc;
          console.log("✅ [MINT DEBUG] Successfully connected to RPC:", rpc);
          break;
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.warn(
            "⚠️ [MINT DEBUG] Failed to connect to RPC:",
            rpc,
            errorMsg
          );
          continue;
        }
      }

      if (!web3 || !workingRPC) {
        throw new Error("Failed to connect to any Sepolia RPC endpoint");
      }

      console.log(
        "✅ [MINT DEBUG] Web3 instance created with RPC:",
        workingRPC
      );

      // Create account from private key
      console.log("🔍 [MINT DEBUG] Creating account from private key...");
      // Handle both prefixed (0x...) and non-prefixed private keys
      const formattedKey = privateKey.startsWith("0x")
        ? privateKey
        : `0x${privateKey}`;
      console.log(
        "🔍 [MINT DEBUG] Formatted private key length:",
        formattedKey.length
      );

      const account = web3.eth.accounts.privateKeyToAccount(formattedKey);
      web3.eth.accounts.wallet.add(account);
      console.log("✅ [MINT DEBUG] Account created:", account.address);

      // Create contract instance
      console.log("🔍 [MINT DEBUG] Creating contract instance...");

      // Use the correct contract address and ABI with the new Web3 instance
      const dataCoinAddress = "0xa14159C1B383fBCa4A9C197aFC83E01DB4655B24";
      const contract = new web3.eth.Contract(DataCoinABI, dataCoinAddress);

      console.log(
        "✅ [MINT DEBUG] Contract instance created for DataCoin contract at:",
        dataCoinAddress
      );

      // Convert token amount to wei (18 decimals)
      const amountInWei = web3.utils.toWei(tokenAmount.toString(), "ether");
      console.log("🔍 [MINT DEBUG] Amount in Wei:", amountInWei);

      console.log(
        `🎯 [MINT DEBUG] Minting ${tokenAmount} tokens to ${userAddress} from ${account.address}`
      );

      // Check account balance first
      console.log("🔍 [MINT DEBUG] Checking sender account balance...");
      const balance = await web3.eth.getBalance(account.address);
      console.log(
        "💰 [MINT DEBUG] Sender balance:",
        web3.utils.fromWei(balance, "ether"),
        "ETH"
      );

      // Check if account has MINTER_ROLE
      console.log("🔍 [MINT DEBUG] Checking MINTER_ROLE permissions...");
      try {
        const minterRole = web3.utils.keccak256("MINTER_ROLE");
        const hasMinterRole = await contract.methods
          .hasRole(minterRole, account.address)
          .call();
        console.log("� [MINT DEBUG] Has MINTER_ROLE:", hasMinterRole);

        if (!hasMinterRole) {
          throw new Error(
            `Account ${account.address} does not have MINTER_ROLE on the contract`
          );
        }
      } catch (roleError) {
        console.error("❌ [MINT DEBUG] Error checking MINTER_ROLE:", roleError);
        throw roleError;
      }

      // Check if minting is paused
      console.log("🔍 [MINT DEBUG] Checking if minting is paused...");
      try {
        const mintingPaused = await contract.methods.mintingPaused().call();
        console.log("⏸️ [MINT DEBUG] Minting paused:", mintingPaused);

        if (mintingPaused) {
          throw new Error("Token minting is currently paused on the contract");
        }
      } catch (pauseError) {
        console.error(
          "❌ [MINT DEBUG] Error checking pause status:",
          pauseError
        );
        throw pauseError;
      }

      // Estimate gas properly like ethers implementation
      console.log("🔍 [MINT DEBUG] Estimating gas...");
      const gasEstimate = await contract.methods
        .mint(userAddress, amountInWei)
        .estimateGas({ from: account.address });
      console.log("⛽ [MINT DEBUG] Gas estimate:", gasEstimate.toString());

      // Get current gas price
      console.log("🔍 [MINT DEBUG] Getting gas price...");
      const gasPrice = await web3.eth.getGasPrice();
      console.log("💸 [MINT DEBUG] Gas price:", gasPrice.toString(), "wei");

      // Calculate total gas cost
      const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
      console.log(
        "💰 [MINT DEBUG] Total gas cost:",
        web3.utils.fromWei(totalGasCost.toString(), "ether"),
        "ETH"
      );

      // Send transaction
      console.log("📡 [MINT DEBUG] Sending transaction...");
      const tx = await contract.methods.mint(userAddress, amountInWei).send({
        from: account.address,
        gas: gasEstimate.toString(),
        gasPrice: gasPrice.toString(),
      });

      console.log("✅ [MINT DEBUG] Transaction successful!");
      console.log("🔗 [MINT DEBUG] Transaction hash:", tx.transactionHash);
      console.log("📊 [MINT DEBUG] Gas used:", tx.gasUsed);
      console.log("🎉 [MINT DEBUG] Mint process completed successfully!");

      // Fetch and log updated DaoCoin information after minting
      console.log("\n🔄 [MINT DEBUG] Fetching updated DataCoin information...");
      await fetchDaoCoinInfo(userAddress);

      return {
        success: true,
        txHash: tx.transactionHash,
        amount: tokenAmount,
        from: account.address,
      };
    } catch (error) {
      console.error("❌ [MINT DEBUG] Error in mint process:", error);
      console.error(
        "❌ [MINT DEBUG] Error details:",
        error instanceof Error ? error.message : "Unknown error"
      );
      console.error("❌ [MINT DEBUG] Full error object:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        amount: tokenAmount,
      };
    }
  };

  const [showReclaimVerification, setShowReclaimVerification] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const connectToMetaMask = async () => {
    console.log("🔗 [WALLET DEBUG] Starting MetaMask connection...");

    if (window.ethereum) {
      console.log("✅ [WALLET DEBUG] MetaMask detected");

      try {
        console.log("🔍 [WALLET DEBUG] Requesting account access...");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("✅ [WALLET DEBUG] Accounts received:", accounts);
        setAccount(accounts[0]);
        console.log(
          "🔗 [WALLET DEBUG] Connected to MetaMask account:",
          accounts[0]
        );

        const currentAccount = accounts[0];
        if (!currentAccount) {
          throw new Error("No account found after connecting to MetaMask.");
        }

        console.log("🔍 [WALLET DEBUG] Getting lighthouse auth message...");
        const authMessage = await lighthouse.getAuthMessage(currentAccount);
        console.log("📝 [WALLET DEBUG] Auth message received:", authMessage);

        // ask MetaMask to sign it
        console.log("✍️ [WALLET DEBUG] Requesting message signature...");
        const signedMessage = await window.ethereum.request({
          method: "personal_sign",
          params: [authMessage.data.message, currentAccount],
        });
        console.log("✅ [WALLET DEBUG] Message signed successfully");
        console.log("🔏 [WALLET DEBUG] Signed Message:", signedMessage);
        setSignMessage(signedMessage);
        console.log(
          "🎉 [WALLET DEBUG] MetaMask connection completed successfully!"
        );

        // Fetch and display DaoCoin information after connecting
        console.log(
          "\n🔄 [WALLET DEBUG] Fetching DataCoin information for connected account..."
        );
        await fetchDaoCoinInfo(currentAccount);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(
          "❌ [WALLET DEBUG] Error connecting to MetaMask:",
          errorMsg
        );
        console.error("❌ [WALLET DEBUG] Full error:", error);
        alert(`Error connecting to MetaMask: ${errorMsg}`);
      }
    } else {
      console.error("❌ [WALLET DEBUG] MetaMask not detected!");
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
    console.log("📂 [FILE DEBUG] Processing", newFiles.length, "files");

    newFiles.forEach((file, index) => {
      console.log(
        `📄 [FILE DEBUG] File ${index + 1}:`,
        file.name,
        "(" + file.type + ")"
      );

      if (file.type === "text/plain") {
        console.log("✅ [FILE DEBUG] File type valid, reading content...");
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result;
          console.log("📁 [FILE DEBUG] File read successfully:", file.name);
          console.log(
            "📄 [FILE DEBUG] File content length:",
            text?.toString().length
          );

          try {
            console.log(
              "🔍 [FILE DEBUG] Sending file to encryption endpoint..."
            );
            const res = await fetch(
              "https://brfw2w2m-5500.inc1.devtunnels.ms/encrypt",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text,
                  fileName: file.name,
                  pubKey: account,
                  signMess: signMessage,
                }),
              }
            );

            console.log("📡 [FILE DEBUG] Server response status:", res.status);
            const data = await res.json();
            console.log("📊 [FILE DEBUG] Server response data:", data);

            // If upload was successful and user is connected, mint tokens
            // Check if data.data is an array and has at least one element with Hash
            if (data?.data?.[0]?.Hash && account) {
              console.log(
                "🎯 [FILE DEBUG] File uploaded successfully, starting token minting..."
              );
              console.log("🔗 [FILE DEBUG] IPFS Hash:", data.data[0].Hash);
              console.log("👤 [FILE DEBUG] User account:", account);

              const mintResult = await mintTokensToUser(account, 10);
              console.log(
                "🎉 [FILE DEBUG] Token minting completed:",
                mintResult
              );

              // Add mint result to the response
              data.mintResult = mintResult;
            } else {
              console.log(
                "⚠️ [FILE DEBUG] Skipping token minting - conditions not met:"
              );
              console.log("   - Has IPFS Hash:", !!data?.data?.[0]?.Hash);
              console.log("   - Has account:", !!account);
              console.log("   - Data structure:", data?.data);
            }

            setResponses((prev) => [
              ...prev,
              { file: file.name, result: data },
            ]);
          } catch (err) {
            console.error("❌ [FILE DEBUG] Upload error for file:", file.name);
            console.error("❌ [FILE DEBUG] Error details:", err);
          }
        };
        reader.readAsText(file);
      } else {
        console.warn(
          "⚠️ [FILE DEBUG] Unsupported file type:",
          file.type,
          "for file:",
          file.name
        );
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
      <h2 style={styles.title}>File Drag & Drop + Encrypt + Earn Tokens</h2>

      <div style={styles.walletSection}>
        <button onClick={connectToMetaMask} style={styles.connectButton}>
          {account ? "Wallet Connected" : "Connect Wallet"}
        </button>

        {account && (
          <div style={styles.walletInfo}>
            <div>
              <strong>🔗 Connected:</strong> {account.substring(0, 6)}...
              {account.substring(account.length - 4)}
            </div>
            {tokenName && (
              <>
                <div>
                  <strong>🪙 Token:</strong> {tokenName} ({tokenSymbol})
                </div>
                <div>
                  <strong>💰 Your Balance:</strong> {userBalance} {tokenSymbol}
                </div>
                <div>
                  <strong>🌍 Total Mined:</strong> {totalSupply} {tokenSymbol}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showReclaimVerification ? (
        <div style={styles.verificationContainer}>
          <h3>Please complete verification before uploading files</h3>
          <StartReclaimVerification
            onVerificationComplete={handleVerificationComplete}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleSkipVerification} style={styles.skipButton}>
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
          style={{
            ...styles.dropzone,
            ...(dragActive ? styles.activeDropzone : {}),
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p style={styles.dropText}>
            {dragActive
              ? "Release to upload files"
              : "Drag & drop .txt files here"}
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
                {res.result?.data?.[0]?.Hash ? (
                  <div>
                    <div>Uploaded → CID: {res.result.data[0].Hash}</div>
                    {res.result?.mintResult && (
                      <div style={{ marginLeft: "10px", fontSize: "0.9em" }}>
                        {res.result.mintResult.success
                          ? `✅ Sent ${
                              res.result.mintResult.amount
                            } tokens to your wallet! TX: ${res.result.mintResult.txHash?.substring(
                              0,
                              10
                            )}... (via ${res.result.mintResult.from?.substring(
                              0,
                              6
                            )}...)`
                          : `❌ Token transfer failed: ${res.result.mintResult.error}`}
                      </div>
                    )}
                  </div>
                ) : (
                  `Error: ${res.result?.error || "Unknown error"}`
                )}
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
  walletSection: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  connectButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "100%",
    marginBottom: "15px",
  },
  walletInfo: {
    backgroundColor: "#f0fdf4",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #22c55e",
    color: "#15803d",
    fontSize: "14px",
    lineHeight: "1.6",
  },
};
