using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;

namespace GroupBuyingLib.DAL
{
    public class UserDAL
    {
        /// <summary>
        /// Get user details from DB
        /// </summary>
        /// <returns></returns>
        public User GetUserDetails(string username, string password)
        {
            User returnUser = null;   // Return value

            // Get user from DB and return only the first
            List<User> users = DummyData.GetUsersFromDB();
            if (users != null)
            {
                List<User> selectedUsers = users.Where(user => user.UserName == username && user.Password == password).ToList();
                if (selectedUsers.Count == 1)
                    returnUser = selectedUsers.First();
            }
            return returnUser;
        }
    }
}
