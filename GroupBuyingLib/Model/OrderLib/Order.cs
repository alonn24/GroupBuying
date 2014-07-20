using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.Model.OrderLib
{
    [DataContract]
    public class Order
    {
        #region Properties
        [DataMember]
        public int OrderId { get; set; }
        [DataMember]
        public User User { get; set; }
        [DataMember]
        public Product Product { get; set; }
        [DataMember]
        public int Quantity { get; set; }
        [DataMember]
        public DateTime Date { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Default constructor - must implement for serialization
        /// </summary>
        public Order() {
            Date = DateTime.Now;
        }

        /// <summary>
        /// Order must contains orderId and price
        /// </summary>
        public Order(int orderId, User user, Product product) : this() {
            this.OrderId = orderId;
            this.User = user;
            this.Product = product;
            this.Quantity = 1;
        }
        #endregion
    }
}
