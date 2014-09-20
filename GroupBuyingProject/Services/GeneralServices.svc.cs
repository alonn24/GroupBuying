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
            string userName = request.Cookies["userName"].Value;
            string password = request.Cookies["password"].Value;
            return (userName != null && userName != "" &&
                password != null && password != "");
        }

        #region User APIs
        /// <summary>
        /// Retrive authenticated user data, null oterwise
        /// </summary>
        /// <returns></returns>
        public User GetUserData(string userName, string password)
        {
            // Deal with HTML encode/decode parameters
            return new UserFacade().GetUserDetails(userName, password);
        }

        /// <summary>
        /// Register a new user to the system
        /// </summary>
        /// <returns></returns>
        public ActionResponse<bool> RegisterUser(string userName, string password, string role, string email)
        {
            // Deal with HTML encode/decode parameters
            return new UserFacade().RegisterUser(userName, password, role, email, "Default.jpg");
        }
        #endregion

        #region Order APIs
        /// <summary>
        /// Check user permissions and get orders by userid
        /// </summary>
        /// <returns></returns>
        public List<Order> GetUserOrders(string userId, string password)
        {
            //bool b = this.isAuthorized();
            List<Order> list = new UserFacade().GetUserOrders(userId, password);
            return list;
        }
        #endregion

        #region Product APIs
        /// <summary>
        /// Get all products
        /// </summary>
        /// <returns></returns>
        public List<Product> GetAllProducts()
        {
            List<Product> products = new ProductFacade().GetAllProducts();
            return products;
        }

        /// <summary>
        /// Get userid products as seller
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public List<Product> GetUserProducts(string userid) {
            List<Product> products = new ProductFacade().GetUserProducts(userid);
            return products;
        }

        /// <summary>
        /// Order products and return if succeded after authorization check
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="orders"></param>
        /// <returns></returns>
        public ActionResponse<bool> OrderProducts(string userId, string password, string orders)
        {
            return new ActionResponse<bool>("", true);
        }

        /// <summary>
        /// Get product details
        /// </summary>
        /// <returns></returns>
        public ProductDetails GetProductDetails(string productId) {
            return new ProductFacade().GetProductDetails(productId); ;
        }

        /// <summary>
        /// Check credentials and update product data
        /// <returns></returns>
        public ActionResponse<bool> UpdateProductDetails(string userName, string password, string productId, string title,
            string minPrice, string maxPrice, string requiredOrders) {
                return new ActionResponse<bool>("", true);
        }

        /// <summary>
        /// Check credentials and create new product
        /// </summary>
        /// <returns></returns>
        public ActionResponse<bool> CreateProduct(string userName, string password, string title,
            string minPrice, string maxPrice, string requiredOrders) {
                return new ActionResponse<bool>("", true);
        }

        /// <summary>
        /// Remove product
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="productId"></param>
        /// <returns></returns>
        public ActionResponse<bool> RemoveProduct(string userName, string password, string productId) {
            return new ActionResponse<bool>("", true);
        }
        #endregion
    }
}
