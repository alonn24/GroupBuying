﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.BL.Commands;

namespace GroupBuyingLib.BL
{
    public class UserFacade
    {
        /// <summary>
        /// Check user authorization and return user data
        /// return null if unauthorized
        /// </summary>
        /// <returns>User or null if unauthorized</returns>
        public User GetUserDetails(string userName, string password)
        {
            User user = new UserDAL().GetUserDetails(userName, password);
            if(user != null)
                user.Authorized = true;
            return user;
        }

        /// <summary>
        /// Perform checks and register a new user
        /// </summary>
        /// <returns>Action success</returns>
        public ActionResponse<bool> RegisterUser(string username, string password, string role, string email, string profile)
        {
            ICommand<ActionResponse<bool>> command = new RegisterUserCommand(username, password, role, email, profile);
            command.execute();
            return command.Result;
        }

        public List<Order> GetUserOrders(string userName, string password)
        {
            // Check permissions
            List<Order> userOrders = null;
            if (GetUserDetails(userName, password) != null)
            {
                // Get data from DAL
                return new OrderDAL().GetUserOrders(userName);
            }
            return userOrders;
        }
    }
}
