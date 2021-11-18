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
            var me = GetUser();
            return Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
        public Task Play(string gameId, string move)
        {

            return Task.CompletedTask;
        }

    }
}
