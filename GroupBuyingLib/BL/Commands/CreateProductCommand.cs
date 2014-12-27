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
    class CreateProductCommand : ICommand<ActionResponse<Product>> {
        private Product m_productToCreate;
        /// <summary>
        /// Result
        /// </summary>
        public ActionResponse<Product> Result
        {
            get;
            set;
        }

        /// <summary>
        /// Constractor
        /// </summary>
        public CreateProductCommand(string seller, Product product)
        {
            m_productToCreate = product;
            m_productToCreate.Seller = new UserDAL().GetUserDetails(seller);
            m_productToCreate.DatePosted = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day); ;
        }

        /// <summary>
        /// Execute
        /// </summary>
        public void execute()
        {
            ProductDAL productDAL = new ProductDAL();
            try
            {
                int productId = productDAL.CreateProduct(m_productToCreate);
                Product product = productDAL.GetProductById(productId);
                Result = new ActionResponse<Product>("OK", true, product);
            }
            catch (Exception ex)
            {
                Result = new ActionResponse<Product>("Failed to create product.");
            }
        }
    }
}
