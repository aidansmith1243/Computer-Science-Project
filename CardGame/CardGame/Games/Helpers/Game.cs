using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games.Helpers
{
    public abstract class Game
    {
        // Props
        public string Id { get; set; }
        public List<string> Players { get; set; }
        public int CurrentTurn { get; set; }
        public int MoveCount { get; set; }
        public Deck Deck { get; set; }

        public bool GameCompleted { get; set; }

        protected string gameState;

        // Methods
        public abstract bool Play(string player, string move);
        public abstract string GetGameState(string user);
        public Game(List<string> players)
        {
            Players = players;
            Random r = new Random();
            CurrentTurn = r.Next(0, Players.Count);
            MoveCount = 0;
            gameState = "";
            Deck = new Deck();
            GameCompleted = false;
        }

    }
}
