using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;

using System.Web;
using System.Data.OleDb;
using System.Data;

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
                    (string)row["Password"],
                    (string)row["Role"]);
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
            //DataView view = query.AsDataView();
            DataRow first = query.SingleOrDefault<DataRow>();
            
            // If user exists
            if (first != null)
                returnUser = FromRow(first);

            return returnUser;
        }
    }
}
