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
        public static DataTable getActiveProductsTable()
        {
            DataTable tblFiltered = DataProvider.Instance.getTable("Products").AsEnumerable()
            .Where(row => row.Field<Boolean>("isActive") == true)
            .CopyToDataTable();
            return tblFiltered;
        }

        /// <summary>
        /// Convert row to product
        /// </summary>
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
        /// Get all products
        /// </summary>
        public List<Product> GetAllProducts() {
            return GetProductsWhere(p => true);
        }

        /// <summary>
        /// Get seller products
        /// </summary>
        public List<Product> GetMerchantProducts(string userName)
        {
            return GetProductsWhere(p => p.Seller.UserName == userName);
        }

        /// <summary>
        /// Get product by product id
        /// </summary>
        public Product GetProductById(int productId) {
            return GetProductsWhere(p => p.ProductId == productId).First();
        }

        /// <summary>
        /// Create a new product
        /// </summary>
        /// <returns>New product id</returns>
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

        /// <summary>
        /// Update product details
        /// </summary>
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

        /// <summary>
        /// Get products after applying filter
        /// </summary>
        /// <param name="filter">Filter to apply</param>
        /// <returns></returns>
        private List<Product> GetProductsWhere (Func<Product, bool> filter) {
            List<Product> products = new List<Product>();

            // Get products table
            DataTable Products = ProductDAL.getActiveProductsTable();
            DataTable Users = DataProvider.Instance.getTable("Users");

            // Get products with users
            var query = from user in Users.AsEnumerable()
                        from product in Products.AsEnumerable()
                        where product.Field<String>("Seller") == user.Field<String>("UserName")
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

            return products.Where(filter).ToList(); ;
        }
    }
}

