using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;

namespace GroupBuyingLib.BL.Commands
{
    public class RegisterUserCommand : ICommand<ActionResponse>
    {
        private User m_userToRegister;
        /// <summary>
        /// Result
        /// </summary>
        private ActionResponse m_message;
        public ActionResponse Result
        { 
            get { 
                return m_message;
            }
        }

        /// <summary>
        /// Constractor
        /// </summary>
        public RegisterUserCommand(string userName, string password, string role, string email, string profile) {
            m_userToRegister = new User(userName, password, role);
            if (email != null)
                m_userToRegister.Email = email;
            if (profile != null)
                m_userToRegister.Profile = profile;
        }

        /// <summary>
        /// Execute
        /// </summary>
        public void execute() {
            m_message = new UserDAL().RegisterUser(m_userToRegister);
        }
    }
}
