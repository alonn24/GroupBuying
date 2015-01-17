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
    public class OrderDAL
    {
        /// <summary>
        /// Get not fulfilled orders
        /// </summary>
        public static DataTable getNotFulfilledOrders()
        {
            DataTable tblFiltered = DataProvider.Instance.getTable("Orders").AsEnumerable()
            .Where(row => row.Field<int?>("priceFulfilled") == null && row.Field<bool>("isActive") == true)
            .CopyToDataTable();
            return tblFiltered;
        }

        /// <summary>
        /// Convert row to order
        /// </summary>
        public static Order FromRow(DataRow row, User buyer, Product product)
        {
            Order returnOrder = new Order(
                (int)row["OrderId"],
                buyer,
                product);
            returnOrder.Date = (DateTime)row["OrderDate"];
            returnOrder.Quantity = (int)row["Quantity"];

            return returnOrder;
        }

        /// <summary>
        /// Return product orders
        /// </summary>
        public List<Order> GetProductOrders(int productId)
        {
            return  getOrdersWhere(o => o.Product.ProductId == productId);
        }

        /// <summary>
        /// Get buyer orders
        /// </summary>
        /// <returns></returns>
        public List<Order> GetUserOrders(string userName)
        {
            return getOrdersWhere(o => o.User.UserName == userName);
        }

        /// <summary>
        /// Get merchant orders
        /// </summary>
        public List<Order> GetMerchantOrders(string merchant) {
            return getOrdersWhere(o => o.Product.Seller.UserName == merchant);
        }

        /// <summary>
        /// Perform order
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public int order(OrderRequest order) {
            // Add product to db
            Object[] parameters = new Object[] {
                order.Buyer, order.ProductId, order.Quantity, order.OrderDate
            };
            var res = DataProvider.Instance.executeCommand("INSERT INTO Orders" +
                " ([Buyer], [ProductId], [Quantity], [OrderDate], [isActive])" +
                " VALUES (@p0, @p1, @p2, @p3, true)", parameters);
            return (int)res;
        }

        public void fulfill(Order order, int price) {
            Object[] parameters = new Object[] {
                price, order.OrderId
            };
            var res = DataProvider.Instance.executeCommand("UPDATE Orders" +
                " SET [priceFulfilled]=@p0" +
                " WHERE [OrderId]=@p1", parameters);
        }

        /// <summary>
        /// Get orders after applying the filter
        /// </summary>
        /// <param name="filter">Filter order by</param>
        /// <returns></returns>
        private List<Order> getOrdersWhere(Func<Order, bool> filter)
        {
            List<Order> orders = new List<Order>(); // Return value

            // Get tables
            DataTable Products = ProductDAL.getActiveProductsTable();
            DataTable Users = DataProvider.Instance.getTable("Users");
            DataTable Orders = OrderDAL.getNotFulfilledOrders();

            // Get orders with users
            var query = from seller in Users.AsEnumerable()
                        from buyer in Users.AsEnumerable()
                        from product in Products.AsEnumerable()
                        from order in Orders.AsEnumerable()
                        where seller.Field<String>("UserName") == product.Field<String>("Seller") &&
                        buyer.Field<String>("UserName") == order.Field<String>("Buyer") &&
                        product.Field<int>("ProductId") == order.Field<int>("ProductId")
                        select new
                        {
                            Product = product,
                            Seller = seller,
                            Buyer = buyer,
                            Order = order
                        };
            // Create objects
            foreach (var queryObj in query)
            {
                User seller = UserDAL.FromRow(queryObj.Seller);
                Product product = ProductDAL.FromRow(queryObj.Product, seller);
                User buyer = UserDAL.FromRow(queryObj.Buyer);
                Order order = FromRow(queryObj.Order, buyer, product);
                orders.Add(order);
            }
            return orders.Where(filter).ToList();
        }
    }
}
