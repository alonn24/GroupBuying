using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;

namespace GroupBuyingLib.BL.Commands
{
    class FulfillOrderCommand : ICommand<ActionResponse<bool>> {
        private int m_price;
        private Order m_orderToFulfill;

        /// <summary>
        /// Result
        /// </summary>
        public ActionResponse<bool> Result
        {
            get;
            set;
        }

        /// <summary>
        /// Constractor
        /// </summary>
        public FulfillOrderCommand(Order order, int price)
        {
            m_orderToFulfill = order;
            m_price = price;
        }

        /// <summary>
        /// Execute
        /// </summary>
        public void execute()
        {
            OrderDAL orderDAL = new OrderDAL();
            try
            {
                orderDAL.fulfill(m_orderToFulfill, m_price);
                Result = new ActionResponse<bool>(true);
            }
            catch (Exception ex)
            {
                Result = new ActionResponse<bool>("Failed to update product.");
            }
        }
    }
}
