using CardGame.Games.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        public override string GetGameState(string user)
        {
            var me = playerData.Where(x => x.Name == user).FirstOrDefault();
            var otherPlayers = (from p in playerData
                               where p.Name != user
                               select new 
                { 
                    Name = p.Name,
                    Cards = p.Hand.CardDeck.Count,
                    CardSlot = p.CenterSlot,
                    Score = p.Score,
                }).ToList();

            var state = new
            {
                Player = me,
                Others = otherPlayers
            };
            return JsonConvert.SerializeObject(state);
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

        public override bool Play(string player, string move)
        {
            bool validMove = false;

            dynamic mov = JObject.Parse(move);
            Card playedCard;
            try
            {
                char s = mov.suit.ToString()[0];
                char r = mov.rank.ToString()[
                    mov.rank.ToString().Length == 2 ? 1 : 0
                ];

                playedCard = new Card(r, s);
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            Console.WriteLine($"Played {playedCard}");

            //From move:
            HeartPlayer curPlayer = playerData.Where(p => p.Name == player).FirstOrDefault();
            
            if(curPlayer.Hand.CardDeck.Contains(playedCard) && curPlayer.CenterSlot == null)
            {
                curPlayer.Hand.CardDeck.Remove(playedCard);
                curPlayer.CenterSlot = playedCard;
                validMove = true;
            }
            else
            {
                Console.WriteLine(curPlayer.Hand.CardDeck.Contains(playedCard));
                return false;
            }


            if(validMove) { MoveCount++; }
            return validMove;
        }
        private class HeartPlayer
        {
            public string Name { get; set; }
            public Deck Hand { get; set; }
            public Card CenterSlot { get; set; }
            public int Score { get; set; }
            public HeartPlayer(string name)
            {
                Name = name;
                CenterSlot = null;
                Hand = new Deck(false, true);
            }
            public override bool Equals(object obj)
            {
                var other = obj as HeartPlayer;
                if (other == null) return false;
                return this.Name.Equals(other.Name);
            }

            public override int GetHashCode() { return base.GetHashCode(); }
        }

    }
}
    
