using System.Runtime.Serialization;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GroupBuyingProject.Request
{
    [DataContract]
    public class UserRequest
    {
        [DataMember]
        public string UserName { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string Role { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public string Profile { get; set; }
    }
}