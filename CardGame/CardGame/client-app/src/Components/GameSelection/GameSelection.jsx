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

        {/* <GameCard
          title='Hearts'
          link='/Hearts'
          info='https://en.wikipedia.org/wiki/Hearts_(card_game)'
          players='4'
          invite={handlePlay}
        />
        <GameCard
          title='Crazy Eights'
          link='/Crazy_Eights'
          info='https://en.wikipedia.org/wiki/Crazy_Eights'
          players='2+'
          invite={handlePlay}
        /> */}
      </div>
    </div>
  );
};

export default GameSelection;
