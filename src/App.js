import logo from './logo.svg';
import './App.css';
import Card from './Card';
import React, { useRef } from 'react';

function App() {
  const generateShuffledCards = () => {
    const values = [1,1,2,2,3,3,4,4,5,5,6,6]; // 6 pairs
    // Fisher-Yates Shuffle
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
  function flipCard(index) {
  
    const newCards = [...cards];
    newCards[index].on = !newCards[index].on;
    setCards(newCards);
    setTimeout(3000);
    setSelected(prevSelected => {
      const newSelected = [...prevSelected, index];
    
      if (newSelected.length === 2) {
        checkMatching(newSelected);
      }
      
      return newSelected;
    });
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
  
        const checkGame = newCards.filter(i => i.visible).length;
        if (checkGame === 0) {
          endGame();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        newCards[firstIndex].on = false;
        newCards[secondIndex].on = false;
  
        setCards(newCards);
        setSelected([]);
      }, 250);
    }
  }
  
  
  function endGame() {
    setWinner(true);
  }

  return (
    <div className='centeralize'>
    <h1 className="moves">{moves}</h1>
    <div className="main">
      {cards.map((card,index) =>
        <Card value={card.value}
        on={card.on}
        visible={card.visible}
        cardIndex={index}
        handleClick={flipCard}
        key={index}/>)}
    </div>
    {winner && <h2>You Win! 🎉 Took you {moves} moves</h2>}
    </div>
  );
}

export default App;
