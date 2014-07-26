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
            
            String sConnectionString =
                "Provider=Microsoft.ACE.OLEDB.12.0;" +
                "Data Source=" + HttpContext.Current.Server.MapPath("../Database.accdb") + ";";
            
            OleDbConnection objConn = new OleDbConnection(sConnectionString);

            objConn.Open();

            OleDbCommand objCmdSelect = new OleDbCommand("SELECT * FROM Users   ", objConn);
            OleDbDataAdapter objAdapter1 = new OleDbDataAdapter();
            objAdapter1.SelectCommand = objCmdSelect;
            DataSet objDataset1 = new DataSet();
            objAdapter1.Fill(objDataset1);
            DataTable Users = objDataset1.Tables[0];

            EnumerableRowCollection<DataRow> query = from user in Users.AsEnumerable()
                                         where user.Field<String>("UserName") ==  username &&
                                                     user.Field<String>("Password") == password
                                         select user;

            
            // Bind data to DataGrid control.
            DataView view = query.AsDataView();
            if (view.Count == 1) { 
                DataRowView row = view[0];
                returnUser = new User((string)row["UserName"], 
                    (string)row["Password"], 
                    (string)row["Role"]);
                returnUser.Email = row["Email"].ToString();
                returnUser.Profile = (string)row["Profile"];
                returnUser.Authorized = (bool)row["Authorized"];
            }

            objConn.Close();

            return returnUser;
        }
    }
}
