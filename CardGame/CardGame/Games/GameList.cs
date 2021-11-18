using CardGame.Games.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games
{
    public class GameList
    {
        public List<Game> Games { get; set; }
        public GameList()
        {
            Games = new List<Game>();
        }
        public Game this[string key]
        {
            get => Games.Find(x => x.Id == key);
        }
        public string CreateGame(string game)
        {
            string id = Guid.NewGuid().ToString();
            Game createdGame = null;
            switch(game.ToLower())
            {
                case "hearts":
                    createdGame = new Hearts() { Id = id };
                    break;
            }
            if(createdGame != null)
            {
                Games.Add(createdGame);
            }
            return id;
        }
        public void EndGame(string id)
        {
            Games.Remove(this[id]);
        }
    }
}
