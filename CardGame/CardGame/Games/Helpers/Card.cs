using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games.Helpers
{
    public class Card
    {
        public char RANK { get; set; }
        public char SUIT { get; set; }
        public Card(char rank, char suit)
        {
            RANK = rank;
            SUIT = suit;
        }
        public override string ToString()
        {
            return $"Card: {RANK}|{SUIT}";
        }
    }
}
