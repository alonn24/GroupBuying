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
    public class OrderProductCommand : ICommand<ActionResponse<bool>>
    {
        private OrderRequest m_orderRequest;

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
        public OrderProductCommand(string buyer, OrderRequest orderRequest)
        {
            this.m_orderRequest = orderRequest;
            this.m_orderRequest.Buyer = buyer;
            this.m_orderRequest.OrderDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
        }

        public void execute()
        {
            OrderDAL orderDAL = new OrderDAL();
            try
            {
                orderDAL.orderProducts(m_orderRequest);
                Result = new ActionResponse<bool>(true);
            }
            catch (Exception ex)
            {
                Result = new ActionResponse<bool>("Failed to order product.");
            }
        }
    }
}
