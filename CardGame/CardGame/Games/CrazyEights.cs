using CardGame.Games.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games
{
    public class CrazyEights : Game
    {
        private List<CrazyEightsPlayer> playerData;
        public CrazyEights(List<string> players) : base(players)
        {
            InitializeGame();
        }
        public void InitializeGame()
        {
            playerData = new List<CrazyEightsPlayer>();
            int count = 0;
            foreach (var p in Players)
            {
                CrazyEightsPlayer temp = new CrazyEightsPlayer(p, count);
                count++;
                for (int i = 0; i < 5; i++)
                {
                    temp.Hand.Add(Deck.Draw());
                    temp.Hand.ArrangeCardsSuitOrder();
                }
                playerData.Add(temp);
            }
            Deck.Discard(Deck.Draw());
        }
        public override string GetGameState(string user)
        {
            var me = playerData.Where(x => x.Name == user).FirstOrDefault();
            var otherPlayers = (from p in playerData
                                where p.Name != user
                                select new
                                {
                                    Name = p.Name,
                                    Hand = p.Hand.CardDeck.Count,
                                    PlayerOrder = p.PlayerOrder,
                                }).ToList();

            var state = new
            {
                CenterSlot = Deck.DiscardDeck,
                DrawPile = Deck.CardDeck.Count,
                Player = me,
                Others = otherPlayers,
                CurrentTurn = CurrentTurn,
            };
            return JsonConvert.SerializeObject(state);
        }

        public override bool Play(string player, string move)
        {
            bool validMove = false;
            //validate current player
            CrazyEightsPlayer curPlayer = playerData.Where(p => p.Name == player).FirstOrDefault();
            if (curPlayer.PlayerOrder != CurrentTurn)
                return validMove;

            Card playedCard;
            if (move == "draw")
            {
                // Replace the draw deck
                if(Deck.CardDeck.Count == 0)
                {
                    var index = Deck.DiscardDeck.Count - 1;

                    var topCard = Deck.DiscardDeck[index];
                    Deck.DiscardDeck.RemoveAt(index);
                    Deck.ReShuffle();
                    Deck.DiscardDeck.Add(topCard);
                    //todo: add condition if out of cards
                }

                curPlayer.Hand.CardDeck.Add(Deck.Draw());
                curPlayer.Hand.ArrangeCardsSuitOrder();
                validMove = true;
            }
            else
            {
                try
                {
                    playedCard = parseJsonToCard(move);
                }
                catch
                {
                    return validMove;
                }
                var currentTopCard = Deck.DiscardDeck.LastOrDefault();
                validMove = validatePlayCard(currentTopCard, playedCard);
                if(validMove)
                {
                    curPlayer.Hand.CardDeck.Remove(playedCard);
                    Deck.Discard(playedCard);
                }
                
            }
            if(validMove)
            {
                MoveCount++;
                CurrentTurn += 1; 
                CurrentTurn %= 4;
            }
            return validMove;
        }
        private bool validatePlayCard(Card topCard, Card playedCard)
        {
            return (
                topCard.SUIT == playedCard.SUIT || 
                topCard.RANK == playedCard.RANK || 
                playedCard.RANK == '8');
        }

        private Card parseJsonToCard(string json)
        {
            // convert move json string to the card played
            dynamic mov = JObject.Parse(json);
            Card playedCard;
            try
            {
                char s = mov.suit.ToString()[0];
                char r = mov.rank.ToString()[
                    mov.rank.ToString().Length == 2 ? 1 : 0
                ];

                playedCard = new Card(r, s);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw new InvalidOperationException();
            }
            Console.WriteLine($"Played {playedCard}");
            return playedCard;
        }

        private class CrazyEightsPlayer 
        {
            public string Name { get; set; }
            public Deck Hand { get; set; }
            public int PlayerOrder { get; set; }
            public CrazyEightsPlayer(string name, int order)
            {
                Name = name;
                PlayerOrder = order;
                Hand = new Deck(false, true);
            }
            public override bool Equals(object obj)
            {
                var other = obj as CrazyEightsPlayer;
                if (other == null) return false;
                return this.Name.Equals(other.Name);
            }

            public override int GetHashCode() { return base.GetHashCode(); }
        }
    }
    
}
