using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.DAL
{
    class ProductDAL
    {
        /// <summary>
        /// Get all products from DB
        /// </summary>
        /// <returns></returns>
        public List<Product> GetAllProducts() {
            List<Product> products = DummyData.GetProductsFromDB();
            return products;
        }

        /// <summary>
        /// Get user products as seller
        /// </summary>
        /// <returns></returns>
        public List<Product> GetUserProducts(string userid)
        {
            List<Product> products = DummyData.GetProductsFromDB();
            return products.Where(product => product.Seller.UserName == userid).ToList();
        }

        /// <summary>
        /// Return the product by product id, default value if not exists
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Product GetProductById(int productId) {
            List<Product> products = DummyData.GetProductsFromDB();
            return products.FirstOrDefault(product => product.ProductId == productId);
        }

        /// <summary>
        /// Return product orders
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public List<Order> GetProductOrders(int productId)
        {
            List<Order> orders = DummyData.GetOrdersFromDB();
            return orders.Where(order => order.Product.ProductId == productId).ToList();
        }
    }
}
