﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Games.Helpers
{
    public class Deck
    {
        public static readonly char[] SUITS = { 'H', 'D', 'S', 'C' };
        public static readonly char[] RANKS = { 'A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K' };
        public List<Card> CardDeck { get; set; }
        public List<Card> DiscardDeck { get; set; }
        public Deck(bool shuffle = true)
        {
            DiscardDeck = new List<Card>();
            CreateDeck();
            if(shuffle) Shuffle();
        }
        public void CreateDeck()
        {
            CardDeck = new List<Card>();
            foreach(var s in SUITS)
            {
                foreach(var r in RANKS)
                {
                    CardDeck.Add(new Card(r, s));
                }
            }
        }
        public void DiscardCard(Card card)
        {
            DiscardDeck.Add(card);
        }
        public void ReShuffle()
        {
            CardDeck.AddRange(DiscardDeck);
            DiscardDeck = new List<Card>();
            Shuffle();
        }
        public void Shuffle()
        {
            Random r = new Random();

            int n = CardDeck.Count();
            for(int i = n-1; i > 1; i--)
            {
                int j = r.Next(0, i + 1);
                var temp = CardDeck[i];
                CardDeck[i] = CardDeck[j];
                CardDeck[j] = temp;
            }
        }
        public Card Draw()
        {
            int index = CardDeck.Count - 1;
            var card = CardDeck[index];
            CardDeck.RemoveAt(index);
            return card;
        }
    }
}