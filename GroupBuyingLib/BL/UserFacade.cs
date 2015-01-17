using System;
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
        public ActionResponse<User> GetUserDetails(string userName, string password)
        {
            User user = new UserDAL().GetUserDetails(userName, password);
            if (user == null)
                return new ActionResponse<User>("User does not exist");
            else
                return new ActionResponse<User>(user);
        }

        /// <summary>
        /// Perform checks and register a new user
        /// </summary>
        /// <returns>Action success</returns>
        public ActionResponse<bool> RegisterUser(string username, string password, string email, string profile)
        {
            ICommand<ActionResponse<bool>> command = new RegisterUserCommand(username, password, email, profile);
            command.execute();
            return command.Result;
        }

        public List<Order> GetUserOrders(string userName)
        {
            return new OrderDAL().GetUserOrders(userName);
        }

        public List<Order> GetMerchantOrders(string merchant)
        {
            return new OrderDAL().GetMerchantOrders(merchant);
        }
    }
}
