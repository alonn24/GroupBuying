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
        /// Get active products
        /// </summary>
        /// <returns></returns>
        private DataTable getActiveProductsTable()
        {
            DataTable tblFiltered = DataProvider.Instance.getTable("Products").AsEnumerable()
            .Where(row => row.Field<Boolean>("isActive") == true)
            .CopyToDataTable();
            return tblFiltered;
        }

        /// <summary>
        /// Convert row to product
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public static Product FromRow(DataRow row, User seller) {
            Product returnProduct = new Product(
                (int)row["ProductId"],
                (bool)row["isActive"],
                (string)row["Title"],
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
            DataTable Products = getActiveProductsTable();
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

            // Get tables
            DataTable Products = getActiveProductsTable();
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

            // Get tables
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
        }

        /// <summary>
        /// Return product orders
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public List<Order> GetProductOrders(int productId) {
            List<Order> orders = new List<Order>(); // Return value

            // Get tables
            DataTable Products = DataProvider.Instance.getTable("Products");
            DataTable Users = DataProvider.Instance.getTable("Users");
            DataTable Orders = DataProvider.Instance.getTable("Orders");

            // Get orders with users
            var query = from seller in Users.AsEnumerable()
                        from buyer in Users.AsEnumerable()
                        from product in Products.AsEnumerable()
                        from order in Orders.AsEnumerable()
                        where order.Field<int>("ProductId") == productId &&
                        seller.Field<String>("UserName") == product.Field<String>("Seller") &&
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
                Product product = FromRow(queryObj.Product, seller);
                User buyer = UserDAL.FromRow(queryObj.Buyer);
                Order order = OrderDAL.FromRow(queryObj.Order, buyer, product);
                orders.Add(order);
            }

            return orders;
        }

        public int CreateProduct(Product product)
        {
            // Add product to db
            Object[] parameters = new Object[] {
                product.Title, product.MaxPrice,product.MinPrice,
                product.RequiredOrders, product.Image, 
                product.Seller.UserName, product.DatePosted
            };
            var res = DataProvider.Instance.executeCommand("INSERT INTO Products" + 
                " ([Title], [isActive], [MaxPrice], [MinPrice], [RequiredOrders], [Image], [Seller], [DatePosted])" +
                " VALUES (@p0, true, @p1, @p2, @p3, @p4, @p5, @p6)", parameters);
            return (int)res;
        }

        public void UpdateProduct(Product product) {
            Object[] parameters = new Object[] {
                product.Title, product.isActive, 
                product.MaxPrice, product.MinPrice,
                product.RequiredOrders, product.Image, 
                product.Seller.UserName, product.DatePosted,
                product.ProductId
            };
            var res = DataProvider.Instance.executeCommand("UPDATE Products" +
                " SET [Title]=@p0, [isActive]=@p1, [MaxPrice]=@p2, [MinPrice]=@p3, [RequiredOrders]=@p4, " + 
                "[Image]=@p5, [Seller]=@p6, [DatePosted]=@p7" +
                " WHERE [ProductId]=@p8", parameters);
        }
    }
}

