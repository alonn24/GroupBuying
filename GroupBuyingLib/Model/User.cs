using System.Runtime.Serialization;

namespace GroupBuyingLib.Model
{
    [DataContract]
    public class User
    {
        #region Properties
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
        [DataMember]
        public bool Authorized { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Default constructor - must implement for serialization
        /// </summary>
        public User() { }

        /// <summary>
        /// User must contains userName and password
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="role"></param>
        public User(string userName, string password, string role)
        {
            this.UserName = userName;
            this.Password = password;
            this.Role = role;
        }
        #endregion
    }
}
