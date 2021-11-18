using CardGame.Games;
using CardGame.Models;
using CardGame.Models.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CardGame.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GameHub : Hub
    {
        private readonly CardGameRepository _cardGameRepository;
        private readonly GameList _gameList;
        public GameHub(CardGameRepository cardGameRepository, GameList gameList)
        {
            _cardGameRepository = cardGameRepository;
            _gameList = gameList;
        }
        [NonAction]
        public User GetUser()
        {
            return _cardGameRepository.GetUserById(Context.User.Identity.Name); ;
        }

        public Task JoinGame(string gameId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
        public Task Play(string gameId, string move)
        {
            var game = _gameList[gameId];
            if (game == null)
            {
                Console.WriteLine($"ERROR: No game found for: {gameId}");
                return Task.CompletedTask;
            }
            bool canPlay = game.Play(move);
            if(!canPlay)
            {
                return Clients.Client(Context.ConnectionId).SendAsync("InvalidMove");
            }
            string gameState = game.GetGameState();
            return Clients.Groups(gameId).SendAsync("GameUpdate",move,gameState);
        }

    }
}
