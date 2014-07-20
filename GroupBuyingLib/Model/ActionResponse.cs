using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model
{
    [DataContract]
    public class ActionResponse
    {
        [DataMember]
        public bool Succeed { get; set; }
        [DataMember]
        public string Message { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public ActionResponse() { }
        public ActionResponse(bool succeed) {
            this.Succeed = succeed;
        }
        public ActionResponse(string message)
        {
            this.Succeed = false;
            this.Message = message;
        }
    }
}
