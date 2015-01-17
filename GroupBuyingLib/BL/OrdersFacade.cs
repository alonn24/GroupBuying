using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.BL.Commands;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

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
                .Select(c => c.Result)
                .Where(res => res.success == false)
                .ToArray();
        }

        /// <summary>
        /// Fulfill product orders
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="price"></param>
        /// <returns></returns>
        public ActionResponse<bool>[] FulfillProductOrders(string productId, int price)
        {
            ProductFacade productFacade = new ProductFacade();
            ProductDetails product = productFacade.GetProductDetails(productId);
            if (product.CurrentPrice != price)
                return new ActionResponse<bool>[] { new ActionResponse<bool>("Price has changed, please refresh the page.") };
            else {
                List<FulfillOrderCommand> list = product.Orders.Select(o => new FulfillOrderCommand(o, price)).ToList();
                list.ForEach(o => o.execute());
                return list.Select(c => c.Result)
                    .Where(res => res.success == false)
                    .ToArray();
            }
        }
    }
}
