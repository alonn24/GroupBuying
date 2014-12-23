using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;

using System.Web;
using System.Data.OleDb;
using System.Data;
using GroupBuyingLib.BL.Commands;

namespace GroupBuyingLib.DAL
{
    public class UserDAL
    {
        /// <summary>
        /// Convert row to user object
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public static User FromRow(DataRow row) {
            User returnUser = null;   // Return value

            returnUser = new User((string)row["UserName"],
                    (string)row["Password"]);
            returnUser.Email = row["Email"].ToString();
            returnUser.Profile = (string)row["Profile"];
            returnUser.Authorized = (bool)row["Authorized"];

            return returnUser;
        }

        /// <summary>
        /// Get user details from DB
        /// </summary>
        /// <returns></returns>
        public User GetUserDetails(string username, string password)
        {
            User returnUser = null;   // Return value
            // Get data form
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get user from users
            EnumerableRowCollection<DataRow> query = from user in Users.AsEnumerable()
                                         where user.Field<String>("UserName") ==  username &&
                                                     user.Field<String>("Password") == password
                                         select user;
            // Get single
            DataRow first = query.SingleOrDefault<DataRow>();
            
            // If exists
            if (first != null)
                returnUser = FromRow(first);

            return returnUser;
        }

        /// <summary>
        /// Get user details from DB
        /// </summary>
        /// <returns></returns>
        public User GetUserDetails(string username)
        {
            User returnUser = null;   // Return value
            // Get data form
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get user from users
            EnumerableRowCollection<DataRow> query = from user in Users.AsEnumerable()
                                                     where user.Field<String>("UserName") == username
                                                     select user;
            // Get single
            DataRow first = query.SingleOrDefault<DataRow>();

            // If exists
            if (first != null)
                returnUser = FromRow(first);

            return returnUser;
        }

        public ActionResponse<bool> RegisterUser(User user)
        {
            // Check that user not exists
            User existingUser = GetUserDetails(user.UserName);
            if (existingUser != null)
                return new ActionResponse<bool>("User " + user.UserName + " already exists in the system", false);

            // Add user to db
            Object[] parameters = new Object[] {
                user.UserName, user.Password, user.Email, 
                user.Profile, user.Authorized
            };
            DataProvider.Instance.executeCommand("INSERT INTO Users VALUES (@p1, @p2, @p3, @p4, @p5)", parameters);

            return new ActionResponse<bool>("OK", true);

        }
    }
}
