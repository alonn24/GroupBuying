using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model.OrderLib;

namespace GroupBuyingLib.DAL
{
    class OrderDAL
    {
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
