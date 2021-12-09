import GameCard from '../GameCard/GameCard';
import React, { useState } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import './GameSelection.css';
import Games from '../../Data/Games.json';

const GameSelection = (props) => {
  const { setShowInvite } = props;
  const handlePlay = (e, name) => {
    const game = e.target.value;
    setShowInvite({ value: true, game: game });
  };

  return (
    <div className='GameSelection'>
      <div className='flex-container'>
        {Games['games'].map((i) => (
          <GameCard
            key={i.title}
            title={i.title}
            link={i.link}
            info={i.info}
            players={
              i.maxPlayers === i.minPlayers
                ? i.maxPlayers
                : i.minPlayers + '-' + i.maxPlayers
            }
            invite={handlePlay}
          />
        ))}
      </div>
    </div>
  );
};

export default GameSelection;
