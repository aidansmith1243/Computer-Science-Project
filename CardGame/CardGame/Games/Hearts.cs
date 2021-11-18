using CardGame.Games.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games
{
    public class Hearts : Game
    {
        private List<HeartPlayer> playerData;
        private bool AllowHearts;
        public Hearts(List<string> players) : base(players)
        {
            InitializeGame();
        }

        public override string GetGameState()
        {
            throw new NotImplementedException();
        }

        private void InitializeGame()
        {
            AllowHearts = false;
            playerData = new List<HeartPlayer>();
            foreach(var p in Players)
            {
                HeartPlayer temp = new HeartPlayer(p);
                for(int i = 0; i < 13; i++)
                {
                    temp.Hand.Add(Deck.Draw());
                }
                playerData.Add(temp);
            }
        }

        public override bool Play(string move)
        {
            bool validMove = false;

            //From move:
            HeartPlayer player = new HeartPlayer(null);
            Card playedCard = new Card(' ',' ');



            if(validMove) { MoveCount++; }
            return validMove;
        }
        private class HeartPlayer
        {
            public string Name { get; set; }
            public Deck Hand { get; set; }
            public HeartPlayer(string name)
            {
                Name = name;
                Hand = new Deck(false, true);
            }
            public override bool Equals(object obj)
            {
                var other = obj as HeartPlayer;
                return this.Name.Equals(other.Name);
            }

            public override int GetHashCode() { return base.GetHashCode(); }
        }
        private class CenterCardSlot
        { 
            public HeartPlayer Player { get; set; }
            public 
        }

    }
}
    
