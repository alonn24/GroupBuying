using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace GroupBuyingLib.DAL
{
    class DataProvider
    {
        // Singeton instance
        private static DataProvider instance = new DataProvider();
        private DataProvider() { }
        public static DataProvider Instance
        {
            get { return instance; }
        }

        // Connection string
        private String sConnectionString =
                "Provider=Microsoft.ACE.OLEDB.12.0;" +
                "Data Source=" + HttpContext.Current.Server.MapPath("../Database.accdb") + ";";

        /// <summary>
        /// Get table
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public DataTable getTable(String tableName) {
            DataTable table = null;
            OleDbConnection objConn = new OleDbConnection(sConnectionString);
            try
            {
                objConn.Open();

                OleDbDataAdapter objAdapter1 =
                    new OleDbDataAdapter(
                    new OleDbCommand("SELECT * FROM " + tableName, objConn));
                DataSet objDataset1 = new DataSet();
                objAdapter1.Fill(objDataset1);
                table = objDataset1.Tables[0];
            }
            finally
            {
                objConn.Close();
            }
            return table;
        }

        public object executeCommand(String command, Object[] parameters) {
            OleDbConnection objConn = new OleDbConnection(sConnectionString);
            try
            {
                objConn.Open();
                OleDbCommand objCommand = new OleDbCommand(command, objConn);
                // Add parameters
                for (int i = 0; i < parameters.Length; i++)
                {
                    objCommand.Parameters.Add(new OleDbParameter("@p" + i, parameters[i]));
                }
                objCommand.ExecuteScalar();
                return new OleDbCommand("SELECT @@IDENTITY AS 'Identity'", objConn).ExecuteScalar();
            }
            finally
            {
                objConn.Close();
            }
        }
    }
}
