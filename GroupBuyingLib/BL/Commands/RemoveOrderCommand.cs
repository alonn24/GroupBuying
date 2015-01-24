using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;

namespace GroupBuyingLib.BL.Commands
{
    class RemoveOrderCommand : ICommand<ActionResponse<bool>> {
        private int m_orderToRemove;

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
        public RemoveOrderCommand(int orderId)
        {
            m_orderToRemove = orderId;
        }

        /// <summary>
        /// Execute
        /// </summary>
        public void execute()
        {
            OrderDAL orderDAL = new OrderDAL();
            try
            {
                orderDAL.remove(m_orderToRemove);
                Result = new ActionResponse<bool>(true);
            }
            catch (Exception ex)
            {
                Result = new ActionResponse<bool>("Failed to remove order.");
            }
        }
    }
}
