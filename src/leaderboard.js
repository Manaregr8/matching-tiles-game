// Leaderboard.js
import React, { useEffect, useState } from 'react';
import { database } from './firebase.config';
import { ref, onValue } from 'firebase/database';
import './leaderboard.css'; // optional styling

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const scoresRef = ref(database, 'scores');
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sorted = Object.values(data)
          .sort((a, b) => a.moves - b.moves) // top 5 scores
        setScores(sorted);
      }
    });
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard - Top 5 Players</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Moves</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.player}</td>
              <td>{entry.moves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
