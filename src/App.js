import logo from './logo.svg';
import './App.css';
import Card from './Card';
import React, { useRef, useEffect } from 'react';
import { database } from './firebase.config';
import { ref, onValue, set } from "firebase/database";
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';  
function App() {
  const generateShuffledCards = () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,7,7,8,8];
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values.map(val => ({
      value: val,
      on: false,
      visible: true
    }));
  };

  const [cards, setCards] = React.useState(generateShuffledCards);
  const [selected, setSelected] = React.useState([]);
  const [moves, setMoves] = React.useState(0);
  const [winner, setWinner] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [playerName, setPlayerName] = React.useState("");
  const [scoreSubmitted, setScoreSubmitted] = React.useState(false);
  const [confettiShown, setConfettiShown] = React.useState(false);
  const [highScore, setHighScore] = React.useState(null);

  // Confetti
  useEffect(() => {
    if (winner && !confettiShown) {
      fireConfettiForever();
      setConfettiShown(true);
    }
  }, [winner, confettiShown]);

  // Win condition
  useEffect(() => {
    const visibleCount = cards.filter(c => c.visible).length;
    if (visibleCount === 0 && !winner) {
      setWinner(true);
    }
  }, [cards, winner]);

  // Fetch high score
  useEffect(() => {
    const scoresRef = ref(database, 'scores');
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allScores = Object.values(data);
        const best = allScores.reduce((min, curr) =>
          curr.moves < min.moves ? curr : min, allScores[0]
        );
        setHighScore(best);
      }
    });
  }, []);

  // Card flip logic
  function flipCard(index) {
    if (isChecking || cards[index].on || !cards[index].visible) return;

    const newCards = [...cards];
    newCards[index].on = true;
    setCards(newCards);

    setSelected(prevSelected => {
      const newSelected = [...prevSelected, index];

      if (newSelected.length === 2) {
        setIsChecking(true);
        checkMatching(newSelected);
      }

      return newSelected;
    });
  }

  let confettiIntervalId = null;

  function fireConfettiForever() {
    const defaults = {
      startVelocity: 40,
      spread: 120,
      ticks: 100,
      zIndex: 999,
      colors: ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffdd00'],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 6,
        origin: { x: 0, y: Math.random() * 0.8 },
      });

      confetti({
        ...defaults,
        particleCount: 6,
        origin: { x: 1, y: Math.random() * 0.8 },
      });

      confetti({
        ...defaults,
        particleCount: 4,
        origin: { x: 0.5, y: 0 },
      });

      confettiIntervalId = requestAnimationFrame(shoot);
    }

    shoot();
  }

  function checkMatching(newSelected) {
    const [firstIndex, secondIndex] = newSelected;
    setMoves(m => m + 1);

    const newCards = [...cards];

    if (cards[firstIndex].value === cards[secondIndex].value) {
      setTimeout(() => {
        newCards[firstIndex].visible = false;
        newCards[secondIndex].visible = false;

        setCards(newCards);
        setSelected([]);
        setIsChecking(false);
      }, 1000);
    } else {
      setTimeout(() => {
        newCards[firstIndex].on = false;
        newCards[secondIndex].on = false;

        setCards(newCards);
        setSelected([]);
        setIsChecking(false);
      }, 700);
    }
  }

  return (
    <div className='centeralize'>
      <div className='header'>
        <p className="moves">Match Them Tiles</p>
        <div className='scoreheading'>
          <p className='score'>
            High Score : {highScore ? `${highScore.player} ( ${highScore.moves} )` : 'Loading...'}
          </p>
          <p className='score'>Your Score : {moves}</p>
        </div>
      </div>

      <div className="main">
        {cards.map((card, index) =>
          <Card
            value={card.value}
            on={card.on}
            visible={card.visible}
            cardIndex={index}
            handleClick={flipCard}
            key={index}
          />
        )}
      </div>

      {winner && !scoreSubmitted && (
        <div className="winner-form">
          <h2>You Win! 🎉 Took you {moves} moves</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            onClick={() => {
              if (playerName.trim() !== "") {
                set(ref(database, 'scores/' + Date.now()), {
                  player: playerName,
                  moves: moves,
                });
                setScoreSubmitted(true);
              }
            }}
          >
            Submit Score
          </button>
        </div>
      )}

      {winner && scoreSubmitted && <h2>Thanks, {playerName}! 🎉</h2>}
      <p style={{marginTop:"80px"}}><Link style={{textTransform:"uppercase", color:"#ffffff"}}to="/leaderboard">View Leaderboard</Link></p>
    </div>
  );
}

export default App;
