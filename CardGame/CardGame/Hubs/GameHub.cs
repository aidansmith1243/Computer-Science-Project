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
using System.Threading;
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

        public async Task<Task> JoinGame(string gameId)
        {
            if (gameId == null || gameId == "") return Task.CompletedTask;
            var user = GetUser();
            if (user == null) return Task.CompletedTask;

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Groups.AddToGroupAsync(Context.ConnectionId, user.Username);
            
            
            var game = _gameList[gameId];
            Console.WriteLine($"Joined Game {game.GetGameState(user.Username)}");
            //await Clients.Group(user.Username).SendAsync("GameState", game.GetGameState(user.Username));
            //await Clients.Client(Context.ConnectionId).SendAsync("GameState", game.GetGameState(user.Username));
            return Clients.Client(Context.ConnectionId).SendAsync("GameState",game.GetGameState(user.Username));
        }
        public Task Play(string gameId, string move)
        {
            Console.WriteLine($"playing: {move}");

            var user = GetUser();
            var game = _gameList[gameId];
            if (game == null)
            {
                Console.WriteLine($"ERROR: No game found for: {gameId}");
                return Task.CompletedTask;
            }
            bool canPlay = game.Play(user.Username,move);
            string gameState = game.GetGameState(user.Username);
            if (!canPlay)
            {
                Console.WriteLine("Invalid Move");
                return Clients.Client(Context.ConnectionId).SendAsync("InvalidMove",gameState);
            }

            Console.WriteLine("Game Update");
            foreach(var eachUser in game.Players)
                Clients.Groups(eachUser).SendAsync("GameUpdate",move, game.GetGameState(eachUser));
            
            return Task.CompletedTask;
        }
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"New Connection {Context.ConnectionId}");
            return base.OnConnectedAsync();
        }

    }
}
