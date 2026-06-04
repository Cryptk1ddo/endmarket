export default function Loading() {
  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#f8f8f6", paddingTop: "64px" }}>
      <style>{`
        @keyframes aw-shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .aw-skel {
          background: linear-gradient(90deg, #e8e6e1 25%, #d8d6d1 50%, #e8e6e1 75%);
          background-size: 1200px 100%;
          animation: aw-shimmer 1.6s infinite linear;
          border-radius: 0;
        }
      `}</style>

      {/* Breadcrumb skeleton */}
      <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid #e0ddd8", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <div className="aw-skel" style={{ width: "60px", height: "10px" }} />
        <div style={{ color: "#e0ddd8" }}>·</div>
        <div className="aw-skel" style={{ width: "80px", height: "10px" }} />
        <div style={{ color: "#e0ddd8" }}>·</div>
        <div className="aw-skel" style={{ width: "120px", height: "10px" }} />
      </div>

      {/* Main grid: image + info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="skel-grid">
        {/* Image column */}
        <div style={{ borderRight: "1px solid #e0ddd8" }}>
          <div className="aw-skel" style={{ aspectRatio: "3/4", width: "100%" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e0ddd8" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aw-skel" style={{ aspectRatio: "1/1", borderRight: i < 3 ? "1px solid #e0ddd8" : "none" }} />
            ))}
          </div>
        </div>

        {/* Info column */}
        <div style={{ padding: "2.5rem 2rem 3rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className="aw-skel" style={{ width: "100px", height: "10px" }} />
            <div className="aw-skel" style={{ width: "70%", height: "52px" }} />
            <div className="aw-skel" style={{ width: "180px", height: "12px" }} />
          </div>
          <div style={{ borderTop: "1px solid #e0ddd8", borderBottom: "1px solid #e0ddd8", padding: "1.25rem 0", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="aw-skel" style={{ width: "140px", height: "36px" }} />
            <div className="aw-skel" style={{ width: "80px", height: "14px", marginLeft: "0.5rem" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[1, 0.9, 0.95, 0.6].map((w, i) => (
              <div key={i} className="aw-skel" style={{ width: `${w * 100}%`, height: "13px" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div className="aw-skel" style={{ width: "132px", height: "52px" }} />
            <div className="aw-skel" style={{ flex: 1, height: "52px" }} />
          </div>
          <div className="aw-skel" style={{ width: "100%", height: "48px" }} />
          <div style={{ display: "flex", gap: "1.5rem", borderBottom: "1px solid #e0ddd8", paddingBottom: "0.75rem" }}>
            {[80, 100, 90].map((w, i) => (
              <div key={i} className="aw-skel" style={{ width: `${w}px`, height: "10px" }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[1, 0.85, 1, 0.7].map((w, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0ddd8", paddingBottom: "0.625rem" }}>
                <div className="aw-skel" style={{ width: `${w * 120}px`, height: "10px" }} />
                <div className="aw-skel" style={{ width: "80px", height: "10px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .skel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
