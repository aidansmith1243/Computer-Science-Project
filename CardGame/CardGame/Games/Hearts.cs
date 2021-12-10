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
        private Card StartingCard;
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
                    Hand = p.Hand.CardDeck.Count,
                    CardSlot = p.CenterSlot,
                    Score = p.Score,
                    PlayerOrder = p.PlayerOrder,
                }).ToList();

            var state = new
            {
                Player = me,
                Others = otherPlayers,
                CurrentTurn = CurrentTurn,
            };
            return JsonConvert.SerializeObject(state);
        }

        private void InitializeGame()
        {
            AllowHearts = false;
            playerData = new List<HeartPlayer>();
            StartingCard = null;
            int count = 0;
            foreach(var p in Players)
            {
                HeartPlayer temp = new HeartPlayer(p,count);
                count++;
                for(int i = 0; i < 13; i++)
                {
                    temp.Hand.Add(Deck.Draw());
                    temp.Hand.ArrangeCardsSuitOrder();
                }
                playerData.Add(temp);
            }
        }

        public override bool Play(string player, string move)
        {
            bool validMove = false;

            // convert move json string to the card played
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


            HeartPlayer curPlayer = playerData.Where(p => p.Name == player).FirstOrDefault();

            List<Card> startingCenterCards = playerData.Where(x => x.CenterSlot != null).Select(x => x.CenterSlot).ToList();
            // validate move
            if ( curPlayer.PlayerOrder == CurrentTurn &&
                curPlayer.Hand.CardDeck.Contains(playedCard) && 
                (curPlayer.CenterSlot == null || startingCenterCards.Count >=4 ))
            {
                // first card played
                if(startingCenterCards.Count >= 4 || StartingCard == null)
                {
                    //StartingCard = null;
                    foreach (var x in playerData)
                    {
                        x.CenterSlot = null;
                    }
                    if (
                        playedCard.SUIT == 'H' &&
                        !AllowHearts &&
                        curPlayer.Hand.CardDeck.Where(x => x.SUIT == 'H').ToList().Count != curPlayer.Hand.CardDeck.Count
                        )
                    {
                        return false;
                    }

                    StartingCard = playedCard;
                }
                // Not first Card down
                else
                {
                    // played a different suit then started
                    if(StartingCard.SUIT != playedCard.SUIT && 
                        curPlayer.Hand.CardDeck.Where(x => x.SUIT == StartingCard.SUIT).ToList().Count != 0)
                    {
                        return false;
                    }
                    //set heart status
                    if (playedCard.SUIT == 'H') AllowHearts = true;
                    
                }
                curPlayer.Hand.CardDeck.Remove(playedCard);
                curPlayer.CenterSlot = playedCard;
                validMove = true;
            }
            else
            {
                return false;
            }

            if(validMove) { MoveCount++; CurrentTurn += 1; CurrentTurn %= 4; }

            // Check if 4 cards have been played to calculate score
            List<Card> centerCards = playerData.Where(x => x.CenterSlot != null).Select(x => x.CenterSlot).ToList();
            var RankConvert = new Dictionary<char, int>()
            { {'A',14},{'2',2},{'3',3},{'4',4},{'5',5},{'6',6},{'7',7},{'8',8},{'9',9},{'0',10},{'J',11},{'Q',12},{'K',13} };

            if (centerCards.Count >= 4)
            {
                var winner = playerData
                    .Where(x => x.CenterSlot.SUIT == StartingCard.SUIT)
                    .OrderByDescending(x=> RankConvert[x.CenterSlot.RANK])
                    .FirstOrDefault();
                winner.Score += centerCards.Where(x => x.SUIT == 'H').ToList().Count;
                CurrentTurn = winner.PlayerOrder;
            }

            // Check for game over
            GameCompleted = playerData.Select(x => x.Hand.CardDeck.Count).Where(x => x == 0).ToList().Count == 4;
            

            return validMove;
        }
        private class HeartPlayer
        {
            public string Name { get; set; }
            public Deck Hand { get; set; }
            public Card CenterSlot { get; set; }
            public int Score { get; set; }
            public int PlayerOrder { get; }
            public HeartPlayer(string name,int order)
            {
                Name = name;
                PlayerOrder = order;
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
    
