using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model.OrderLib;

namespace GroupBuyingLib.Model.ProductLib
{
    [DataContract]
    public class ProductDetails
    {
        #region Properties
        [DataMember]
        public Product Product { get; set; }
        [DataMember]
        public List<Order> Orders { get; set; }
        [DataMember]
        public int CurrentPrice { get; set; }
        [DataMember]
        public DateTime DateEnd { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Constractor
        /// </summary>
        public ProductDetails() {
            this.DateEnd = DateTime.Now;
        }
        public ProductDetails(Product product) : this() {
            this.Product = product;
        }
        #endregion
    }
}
