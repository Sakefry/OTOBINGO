import React from 'react';

const WinnersDisplay = ({ project }) => {
  if (!project || !project.participants) {
    return null;
  }

  const winners = Object.entries(project.participants)
    .filter(([userId, data]) => data.bingo)
    .sort(([, a], [, b]) => a.bingo.time - b.bingo.time);

  if (winners.length === 0) {
    return null; // まだ勝者がいない場合は何も表示しない
  }

  return (
    <div className="card winners-display">
      <h3>🏆 達成者ランキング 🏆</h3>
      <ol>
        {winners.map(([userId, data], index) => (
          <li key={userId}>
            <strong>{index + 1}位:</strong> {data.name || userId}
            <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#ccc' }}>
              ({new Date(data.bingo.time).toLocaleTimeString()})
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default WinnersDisplay;
