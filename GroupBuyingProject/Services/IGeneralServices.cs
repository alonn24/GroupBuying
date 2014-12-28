using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingProject.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IGeneralServices" in both code and config file together.
    [ServiceContract]
    public interface IGeneralServices
    {
        #region User APIs
        /// <summary>
        /// RESTful API to retrive user data
        /// </summary>
        [OperationContract]
        [WebInvoke(Method="GET",
            ResponseFormat=WebMessageFormat.Json,
            BodyStyle=WebMessageBodyStyle.Bare,
            UriTemplate="/GetUserData/{userid}/{password}")]
        ActionResponse<User> GetUserData(string userid, string password);

        /// <summary>
        /// RESTful API to register a new user
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST",
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/RegisterUser")]
        ActionResponse<bool> RegisterUser(User user);
        #endregion

        #region Order APIs
        /// <summary>
        /// RESTful API to retrive user orders
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/GetUserOrders/{userid}/{password}")]
        ActionResponse<List<Order>> GetUserOrders(string userid, string password);
        #endregion

        #region Product APIs
        /// <summary>
        /// RESTful API to retrive all products
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/GetProducts")]
        ActionResponse<List<Product>> GetAllProducts();

        /// <summary>
        /// RESTful API to retrive seller products
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/GetProducts/{userid}")]
        ActionResponse<List<Product>> GetUserProducts(string userid);

        /// <summary>
        /// RESTful API to order products
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/OrderProducts/{orders}")]
        ActionResponse<bool> OrderProducts(string orders);

        /// <summary>
        /// RESTful API to get product details
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/GetProductDetails/{productId}")]
        ActionResponse<ProductDetails> GetProductDetails(string productId);

        /// <summary>
        /// RESTful API to update product details
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/UpdateProductDetails/{userName}/{password}/{productId}/{title}/{minPrice}/{maxPrice}/{requiredOrders}")]
        ActionResponse<bool> UpdateProductDetails(string userName, string password, string productId, string title, 
            string minPrice, string maxPrice, string requiredOrders);

        /// <summary>
        /// RESTful API to create new product
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST",
            ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/CreateProduct")]
        ActionResponse<Product> CreateProduct(Product product);

        /// <summary>
        /// RESTful API to create new product
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Bare,
            UriTemplate = "/RemoveProduct/{userName}/{password}/{productId}")]
        ActionResponse<bool> RemoveProduct(string userName, string password, string productId);
        #endregion
    }
}
