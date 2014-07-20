using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model.OrderLib
{
    [DataContract]
    abstract class OrderDecorator : Order
    {
        #region Properties
        [DataMember]
        private Order Order { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Decorator must contains Order
        /// </summary>
        /// <param name="order"></param>
        public OrderDecorator(Order order) : base(order.OrderId, order.User, order.Product) {
            this.Order = order;
        }
        #endregion
    }
}
