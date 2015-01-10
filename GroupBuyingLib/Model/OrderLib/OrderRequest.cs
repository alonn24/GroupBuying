using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model.OrderLib
{
    public class OrderRequest
    {
        #region Properties
        [DataMember]
        public string ProductId { get; set; }
        [DataMember]
        public int Quatity { get; set; }
        [DataMember]
        public string Buyer { get; set; }
        [DataMember]
        public DateTime OrderDate { get; set; }
        #endregion
    }
}
