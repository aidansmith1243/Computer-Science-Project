using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games.Helpers
{
    public abstract class Game
    {
        public string Id { get; set; }
        public List<string> Players;
        public int CurrentTurn;

        protected string gameState;

        public abstract bool Play(string move);
        public abstract string GetGameState();

    }
}
