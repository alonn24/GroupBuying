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
    class ProductDAL
    {
        /// <summary>
        /// Conver row to product
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public static Product FromRow(DataRow row, User seller) {
            Product returnProduct = new Product(
                (int)row["ProductId"],
                (int)row["MinPrice"],
                (int)row["MaxPrice"],
                (int)row["RequiredOrders"],
                seller);
            returnProduct.Image = (string)row["Image"];
            returnProduct.DatePosted = (DateTime)row["DatePosted"];

            return returnProduct;
        }

        /// <summary>
        /// Get all products from DB
        /// </summary>
        /// <returns></returns>
        public List<Product> GetAllProducts() {
            List<Product> products = new List<Product>();   // Return value
            
            // Get products table
            DataTable Products = DataProvider.Instance.getTable("Products");
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get products with users
            var query = from user in Users.AsEnumerable()
                                                     from product in Products.AsEnumerable()
                                                     where product.Field<String>("Seller") == user.Field<String>("UserName")
                                                     select new { 
                                                         Product = product,
                                                         User = user
                                                     };
            // Create objects
            foreach (var queryObj in query) {
                User seller = UserDAL.FromRow(queryObj.User);
                products.Add(FromRow(queryObj.Product, seller));
            }

            return products;
        }

        /// <summary>
        /// Get user products as seller
        /// </summary>
        /// <returns></returns>
        public List<Product> GetUserProducts(string userid)
        {
            List<Product> products = new List<Product>();   // Return value

            // Get products table
            DataTable Products = DataProvider.Instance.getTable("Products");
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get products with users
            var query = from user in Users.AsEnumerable()
                        from product in Products.AsEnumerable()
                        where user.Field<String>("UserName") == userid &&
                        product.Field<String>("Seller") == user.Field<String>("UserName")
                        select new
                        {
                            Product = product,
                            User = user
                        };
            // Create objects
            foreach (var queryObj in query)
            {
                User seller = UserDAL.FromRow(queryObj.User);
                products.Add(FromRow(queryObj.Product, seller));
            }

            return products;
        }

        /// <summary>
        /// Return the product by product id, default value if not exists
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public Product GetProductById(int productId) {
            Product returnProduct = null;   // Return value

            // Get products table
            DataTable Products = DataProvider.Instance.getTable("Products");
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get products with users
            var query = from user in Users.AsEnumerable()
                        from product in Products.AsEnumerable()
                        where product.Field<int>("ProductId") == productId &&
                        product.Field<String>("Seller") == user.Field<String>("UserName")
                        select new
                        {
                            Product = product,
                            User = user
                        };

            // Get single
            
            var first = query.SingleOrDefault();

            // If exists
            if (first != null) {
                User seller = UserDAL.FromRow(first.User);
                returnProduct = FromRow(first.Product, seller);
            }

            return returnProduct;

            /*List<Product> products = DummyData.GetProductsFromDB();
            return products.FirstOrDefault(product => product.ProductId == productId);*/
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
