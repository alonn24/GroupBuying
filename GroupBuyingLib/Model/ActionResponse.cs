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
        public ActionResponse(bool success) {
            this.success = success;
        }


        public ActionResponse(string message)
        {
            this.success = false;
            this.Message = message;
        }

        public ActionResponse(T result)
        {
            this.success = true;
            this.Result = result;
        }
    }
}
