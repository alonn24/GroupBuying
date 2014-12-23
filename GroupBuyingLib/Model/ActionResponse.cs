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
        public bool Succeed { get; set; }
        [DataMember]
        public T Result { get; set; }
        [DataMember]
        public string Message { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public ActionResponse() { }

        public ActionResponse(string message, bool succeed, T result) : this(message, succeed) {
            this.Result = result;
        }

        public ActionResponse(string message, bool succeed) : this(message) {
            this.Succeed = succeed;
        }
        public ActionResponse(string message)
        {
            this.Succeed = false;
            this.Message = message;
        }
    }
}
