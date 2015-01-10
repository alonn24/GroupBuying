using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.BL.Commands;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;

namespace GroupBuyingLib.BL
{
    public class OrdersFacade
    {
        /// <summary>
        /// Perform order product commands
        /// </summary>
        /// <param name="orders"></param>
        /// <returns></returns>
        public ActionResponse<bool>[] OrderProducts(string buyer, OrderRequest[] orders)
        {
            OrderProductCommand[] commands = new OrderProductCommand[orders.Length];
            for(int i=0; i<orders.Length; i++) {
                commands[i] = new OrderProductCommand(buyer, orders[i]);
            }

            for(int i=0; i<commands.Length; i++) {
                commands[i].execute();
            }
            return commands
                .Select<OrderProductCommand, ActionResponse<bool>>(c => c.Result)
                .Where(res => res.success == false)
                .ToArray();
        }
    }
}
