using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel.Activation;
using System.Text;
using System.Web;
using GroupBuyingLib.BL;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingProject.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "GeneralServices" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select GeneralServices.svc or GeneralServices.svc.cs at the Solution Explorer and start debugging.
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class GeneralServices : IGeneralServices
    {
        private bool isAuthorized() {
            HttpRequest request = HttpContext.Current.Request;
            string userName = HttpContext.Current.Request.Headers["User"];
            string password = HttpContext.Current.Request.Headers["Password"];
            return (userName != null && userName != "" &&
                password != null && password != "");
        }

        private string GetUserName() {
            HttpRequest request = HttpContext.Current.Request;
            string userName = HttpContext.Current.Request.Headers["User"];
            return userName;
        }

        #region User APIs
        /// <summary>
        /// Retrive authenticated user data, null oterwise
        /// </summary>
        /// <returns></returns>
        public ActionResponse<User> GetUserData(string userName, string password)
        {
            // Deal with HTML encode/decode parameters
            return new UserFacade().GetUserDetails(userName, password);
        }

        /// <summary>
        /// Register a new user to the system
        /// </summary>
        /// <returns></returns>
        public ActionResponse<bool> RegisterUser(User user)
        {
            // Deal with HTML encode/decode parameters
            return new UserFacade().RegisterUser(user.UserName, user.Password, user.Email, "Default.jpg");
        }
        #endregion

        #region Order APIs
        /// <summary>
        /// Check user permissions and get orders by userid
        /// </summary>
        /// <returns></returns>
        public ActionResponse<List<Order>> GetUserOrders(string userId, string password)
        {
            //bool b = this.isAuthorized();
            List<Order> list = new UserFacade().GetUserOrders(userId, password);
            return new ActionResponse<List<Order>>(list);
        }
        #endregion

        #region Product APIs
        /// <summary>
        /// Get all products
        /// </summary>
        /// <returns></returns>
        public ActionResponse<List<Product>> GetAllProducts()
        {
            List<Product> products = new ProductFacade().GetAllProducts();
            return new ActionResponse<List<Product>>(products);
        }

        /// <summary>
        /// Get userid products as seller
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public ActionResponse<List<Product>> GetUserProducts(string userid)
        {
            List<Product> products = new ProductFacade().GetUserProducts(userid);
            return new ActionResponse<List<Product>>(products);
        }

        /// <summary>
        /// Order products and return if succeded after authorization check
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="orders"></param>
        /// <returns></returns>
        public ActionResponse<bool> OrderProducts(string orders)
        {
            if (!isAuthorized())
            {
                return new ActionResponse<bool>("User is not authorized.");
            }
            else
            {
                return new ActionResponse<bool>(true);
            }
            
        }

        /// <summary>
        /// Get product details
        /// </summary>
        /// <returns></returns>
        public ActionResponse<ProductDetails> GetProductDetails(string productId)
        {
            ProductDetails productDetails = new ProductFacade().GetProductDetails(productId);
            return new ActionResponse<ProductDetails>(productDetails);
        }

        /// <summary>
        /// Check credentials and update product data
        /// <returns></returns>
        public ActionResponse<bool> UpdateProductDetails(Product product) {
            if (!isAuthorized())
            {
                return new ActionResponse<bool>("User is not authorized.");
            }
            else
            {
                return new ProductFacade().UpdateProduct(product);
            }
        }

        /// <summary>
        /// Check credentials and create new product
        /// </summary>
        /// <returns></returns>
        public ActionResponse<Product> CreateProduct(Product product) {
            if (!isAuthorized())
            {
                return new ActionResponse<Product>("User is not authorized.");
            }
            else
            {
                return new ProductFacade().CreateProduct(this.GetUserName(), product);
            }
        }

        /// <summary>
        /// Remove product
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="productId"></param>
        /// <returns></returns>
        public ActionResponse<bool> RemoveProduct(string userName, string password, string productId) {
            return new ActionResponse<bool>(true);
        }
        #endregion
    }
}
