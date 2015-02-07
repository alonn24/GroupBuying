using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.BL.Commands;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.BL
{
    public class ProductFacade
    {
        /// <summary>
        /// Get all products from DAL
        /// </summary>
        /// <returns></returns>
        public List<Product> GetAllProducts() {
            return new ProductDAL().GetAllProducts();
        }

        public List<Product> GetUserProducts(string userid) {
            return new ProductDAL().GetMerchantProducts(userid);
        }

        /// <summary>
        /// Overload method to handle string id
        /// </summary>
        public ProductDetails GetProductDetails(string productIdAsString)
        { 
            // Convert string to int
            int productId;
            if (!int.TryParse(productIdAsString, out productId))
            {
                return null;
            }
            else {
                // Get product from DAL
                ProductDAL productDAL = new ProductDAL();
                OrderDAL orderDAL = new OrderDAL();
                Product product = productDAL.GetProductById(productId);
                List<Order> productOrders = orderDAL.GetProductOrders(productId);

                // Initiate details
                ProductDetails details = new ProductDetails(product);
                details.Orders = productOrders;

                // Set current price
                if (details.Orders.Count > 0 && product.RequiredOrders > 1)
                {
                    // Get total orders
                    int sumOrders = productOrders.Sum(order => order.Quantity);
                    float temp = product.MinPrice + (
                        ((float)(product.MaxPrice - product.MinPrice) /
                        (float)product.RequiredOrders) * (float)(product.RequiredOrders - sumOrders));
                    details.CurrentPrice = (int)temp;
                }
                else
                    details.CurrentPrice = product.MaxPrice;

                // Set End date for month from start date
                details.DateEnd = product.DatePosted.AddMonths(1);
                return details;
            }
        }

        public ActionResponse<Product> CreateProduct(string userName, Product product) {
            CreateProductCommand command = new CreateProductCommand(userName, product);
            command.execute();
            return command.Result;
        }

        public ActionResponse<bool> UpdateProduct(Product product)
        {
            UpdateProductCommand command = new UpdateProductCommand(product);
            command.execute();
            return command.Result;
        }

        public ActionResponse<bool> RemoveProduct(string productId) {
            ProductDetails productDetails = new ProductFacade().GetProductDetails(productId);
            productDetails.Product.isActive = false;
            return this.UpdateProduct(productDetails.Product);
        }
    }
}
