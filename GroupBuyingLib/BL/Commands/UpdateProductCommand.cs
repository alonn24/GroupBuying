using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.BL.Commands
{
    class UpdateProductCommand : ICommand<ActionResponse<bool>>
    {
        private Product m_productToUpdate;
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
        public UpdateProductCommand(Product product)
        {
            m_productToUpdate = product;
            m_productToUpdate.DatePosted = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
        }

        /// <summary>
        /// Execute
        /// </summary>
        public void execute()
        {
            ProductDAL productDAL = new ProductDAL();
            try
            {
                productDAL.UpdateProduct(m_productToUpdate);
                Result = new ActionResponse<bool>(true);
            }
            catch (Exception ex)
            {
                Result = new ActionResponse<bool>("Failed to update product.");
            }
        }
    }
}
