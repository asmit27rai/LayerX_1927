import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Governance() {
  const navigate = useNavigate();
  const totalCoins = 200;

  // Dynamic proposals
  const [proposals] = useState([
    {
      id: 1,
      title: "Increase Staking Rewards",
      description:
        "Propose to increase staking rewards from 5% to 8% APY to incentivize more token holders.",
      votes: 120,
    },
    {
      id: 2,
      title: "Reduce Transaction Fees",
      description:
        "Lower network transaction fees by 50% to improve accessibility for all users.",
      votes: 95,
    },
    {
      id: 3,
      title: "New Token Utility",
      description:
        "Introduce governance token as payment method for premium features and services.",
      votes: 80,
    },
    {
      id: 4,
      title: "Community Grant Program",
      description:
        "Launch $100K community grant program to fund innovative projects in our ecosystem.",
      votes: 150,
    },
  ]);

  return (
    <div style={styles.container}>
      {/* Header with Navigation */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <div style={styles.headerContent}>
          <div style={styles.coinContainer}>
            <div style={styles.coin}>🪙</div>
            <div style={styles.coinGlow}></div>
          </div>
          <h1 style={styles.heading}>Governance Portal</h1>
          <p style={styles.subText}>Shape the future with your voice</p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalCoins}</div>
          <div style={styles.statLabel}>Total Tokens</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{proposals.length}</div>
          <div style={styles.statLabel}>Active Proposals</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {proposals.filter((p) => p.votes / totalCoins > 0.5).length}
          </div>
          <div style={styles.statLabel}>Passed Proposals</div>
        </div>
      </div>

      {/* Proposal List */}
      <div style={styles.proposalsContainer}>
        <h2 style={styles.sectionTitle}>Current Proposals</h2>
        <div style={styles.proposals}>
          {proposals.map((proposal, index) => {
            const passed = proposal.votes / totalCoins > 0.5;
            const percentage = ((proposal.votes / totalCoins) * 100).toFixed(1);

            return (
              <div
                key={proposal.id}
                style={{ ...styles.card, animationDelay: `${index * 0.1}s` }}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{proposal.title}</h3>
                  <div
                    style={{
                      ...styles.status,
                      background: passed
                        ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
                        : "linear-gradient(135deg, #fef9c3, #fde047)",
                      color: passed ? "#166534" : "#92400e",
                    }}
                  >
                    {passed ? "✅ Passed" : "⏳ Voting"}
                  </div>
                </div>
                <p style={styles.cardDesc}>{proposal.description}</p>

                {/* Progress Bar */}
                <div style={styles.progressContainer}>
                  <div style={styles.progressBackground}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${Math.min(Number(percentage), 100)}%`,
                        background: passed
                          ? "linear-gradient(90deg, #10b981, #059669)"
                          : "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                      }}
                    ></div>
                  </div>
                  <div style={styles.progressText}>
                    {percentage}% ({proposal.votes}/{totalCoins})
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <button style={styles.voteButton}>🗳️ Cast Vote</button>
                  <div style={styles.voteInfo}>
                    <span style={styles.voteCount}>{proposal.votes}</span>
                    <span style={styles.voteLabel}>votes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Modern responsive styles with animations
const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    padding: "0",
    position: "relative" as const,
    overflow: "hidden",
  } as React.CSSProperties,
  header: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "20px 0",
    marginBottom: "40px",
    position: "relative" as const,
  } as React.CSSProperties,
  backButton: {
    position: "absolute" as const,
    top: "20px",
    left: "30px",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    zIndex: 10,
  } as React.CSSProperties,
  headerContent: {
    textAlign: "center" as const,
    padding: "20px",
  } as React.CSSProperties,
  coinContainer: {
    position: "relative" as const,
    display: "inline-block",
    marginBottom: "20px",
  } as React.CSSProperties,
  coin: {
    fontSize: "80px",
    position: "relative" as const,
    zIndex: 2,
    animation: "float 3s ease-in-out infinite, rotate 6s linear infinite",
    textShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
  } as React.CSSProperties,
  coinGlow: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120px",
    height: "120px",
    background: "radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent)",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
    zIndex: 1,
  } as React.CSSProperties,
  heading: {
    fontSize: "3rem",
    margin: "0 0 15px 0",
    color: "white",
    fontWeight: "700",
    textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
    letterSpacing: "-0.5px",
  } as React.CSSProperties,
  subText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.2rem",
    fontWeight: "400",
    margin: "0",
  } as React.CSSProperties,
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "0 30px",
    marginBottom: "50px",
  } as React.CSSProperties,
  statCard: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    padding: "30px 20px",
    borderRadius: "20px",
    textAlign: "center" as const,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  } as React.CSSProperties,
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "white",
    margin: "0 0 10px 0",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  } as React.CSSProperties,
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.95rem",
    fontWeight: "500",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  proposalsContainer: {
    padding: "0 30px 50px",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "2rem",
    color: "white",
    textAlign: "center" as const,
    marginBottom: "40px",
    fontWeight: "600",
    textShadow: "0 2px 15px rgba(0, 0, 0, 0.3)",
  } as React.CSSProperties,
  proposals: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
    animation: "slideUp 0.6s ease-out",
  } as React.CSSProperties,
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "cardAppear 0.6s ease-out forwards",
    opacity: 0,
    transform: "translateY(30px)",
  } as React.CSSProperties,
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
    gap: "15px",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: "1.4rem",
    margin: "0",
    color: "#1f2937",
    fontWeight: "600",
    lineHeight: "1.3",
    flex: "1",
    minWidth: "200px",
  } as React.CSSProperties,
  cardDesc: {
    fontSize: "1rem",
    marginBottom: "25px",
    color: "#6b7280",
    lineHeight: "1.6",
    fontWeight: "400",
  } as React.CSSProperties,
  progressContainer: {
    marginBottom: "25px",
  } as React.CSSProperties,
  progressBackground: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "8px",
  } as React.CSSProperties,
  progressBar: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 1s ease-in-out",
    backgroundSize: "20px 20px",
    animation: "shimmer 2s linear infinite",
  } as React.CSSProperties,
  progressText: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "right" as const,
  } as React.CSSProperties,
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "15px",
  } as React.CSSProperties,
  voteButton: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
  } as React.CSSProperties,
  voteInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,
  voteCount: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#3b82f6",
  } as React.CSSProperties,
  voteLabel: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  } as React.CSSProperties,
  status: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "inline-block",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    minWidth: "100px",
    textAlign: "center" as const,
  } as React.CSSProperties,
};
