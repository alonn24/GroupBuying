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
            DataView view = query.AsDataView();
            
            // If there is only one user, get it
            if (view.Count == 1) { 
                DataRowView row = view[0];
                returnUser = new User((string)row["UserName"], 
                    (string)row["Password"], 
                    (string)row["Role"]);
                returnUser.Email = row["Email"].ToString();
                returnUser.Profile = (string)row["Profile"];
                returnUser.Authorized = (bool)row["Authorized"];
            }

            return returnUser;
        }
    }
}
