using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model.ProductLib
{
    public class Product
    {
        #region Properties
        [DataMember]
        public int ProductId { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public int MaxPrice { get; set; }
        [DataMember]
        public int MinPrice { get; set; }
        [DataMember]
        public int RequiredOrders { get; set; }
        [DataMember]
        public string Image { get; set; }
        [DataMember]
        public User Seller { get; set; }
        [DataMember]
        public DateTime DatePosted { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Default constructor - must implement for serialization
        /// </summary>
        public Product() {
            this.DatePosted = DateTime.Now;
        }

        /// <summary>
        /// Product must contains id and price
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="price"></param>
        public Product(int productId, string title, int minPrice, int maxPrice, int requiredOrders, User seller) : this() {
            this.ProductId = productId;
            this.Title = title;
            this.MinPrice = minPrice;
            this.MaxPrice = maxPrice;
            this.RequiredOrders = requiredOrders;
            this.Seller = seller;
        }
        #endregion
    }
}
