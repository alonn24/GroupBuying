using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.DAL
{
    class OrderDAL
    {
        public static Order FromRow(DataRow row, User buyer, Product product)
        {
            Order returnOrder = new Order(
                (int)row["OrderId"],
                buyer,
                product);
            returnOrder.Date = (DateTime)row["OrderDate"];

            return returnOrder;
        }

        /// <summary>
        /// Get user details from DB
        /// </summary>
        /// <returns></returns>
        public List<Order> GetUserOrders(string userName)
        {
            List<Order> orders = DummyData.GetOrdersFromDB();
            if (orders != null)
                return orders.Where(order => order.User.UserName == userName).ToList();
            return null;
        }
    }
}
