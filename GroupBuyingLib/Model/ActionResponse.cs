using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GroupBuyingLib.Model
{
    [DataContract]
    public class ActionResponse<T>
    {
        [DataMember]
        public bool success { get; set; }
        [DataMember]
        public T Result { get; set; }
        [DataMember]
        public string Message { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public ActionResponse() {
            this.success = true;
        }

        public ActionResponse(string message, bool succeed, T result) : this(message, succeed) {
            this.Result = result;
        }

        public ActionResponse(string message, bool succeed) : this(message) {
            this.success = succeed;
        }

        public ActionResponse(string message)
        {
            this.success = false;
            this.Message = message;
        }
    }
}
