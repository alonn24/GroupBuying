using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.DAL;
using GroupBuyingLib.Model;

namespace GroupBuyingLib.BL.Commands
{
    public class RegisterUserCommand : ICommand<ActionResponse<bool>>
    {
        private User m_userToRegister;
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
        public RegisterUserCommand(string userName, string password, string email, string profile) {
            m_userToRegister = new User(userName, password);
            if (email != null)
                m_userToRegister.Email = email;
            if (profile != null)
                m_userToRegister.Profile = profile;
            m_userToRegister.Authorized = true;
        }

        /// <summary>
        /// Execute
        /// Perform user existance check
        /// </summary>
        public void execute()
        {
            UserDAL userDal = new UserDAL();
            // If the user does not exists
            if (userDal.GetUserDetails(m_userToRegister.UserName) != null)
            {
                // Return false resut
                Result = new ActionResponse<bool>("User " + m_userToRegister.UserName + " already exists in the system");
                return;
            }

            try
            {
                // Try to register user
                userDal.RegisterUser(m_userToRegister);
                Result = new ActionResponse<bool>(true);
            }
            catch (Exception)
            {
                // Return general error
                Result = new ActionResponse<bool>("Failed to register user.");
                throw;
            }
        }
    }
}
