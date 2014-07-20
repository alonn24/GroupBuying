using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model.OrderLib
{
    class ShipOrderDecorator : OrderDecorator
    {
        #region Properties
        public string Address { get; set; }
        public DateTime DeliveryDate { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="order"></param>
        public ShipOrderDecorator(Order order) : base(order) { }
        #endregion
    }
}
