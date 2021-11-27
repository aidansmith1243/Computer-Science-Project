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
        public override bool Equals(object obj)
        {
            var other = obj as Card;
            if (other == null) return false;
            return other.RANK == RANK && other.SUIT == SUIT;
        }
    }
}
