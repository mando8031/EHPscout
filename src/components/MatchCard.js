function MatchCard({ match, onClick }) {

  const style = {
    background: "#1f2937",
    padding: "16px",
    borderRadius: "8px",
    cursor: "pointer"
  };

  return (
    <div style={style} onClick={onClick}>
      Match {match.match_number}
    </div>
  );
}

export default MatchCard;
