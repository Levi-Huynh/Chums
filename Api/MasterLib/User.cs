using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MasterLib
{
    public partial class User
    {

        private static string salt = AppSettings.Current.PasswordSalt; //System.Configuration.ConfigurationManager.AppSettings["PasswordSalt"];

        public static string HashPassword(string password)
        {
            SHA1CryptoServiceProvider hasher = new SHA1CryptoServiceProvider();
            byte[] textWithSaltBytes = Encoding.UTF8.GetBytes(string.Concat(password, salt));
            byte[] hashedBytes = hasher.ComputeHash(textWithSaltBytes);
            hasher.Clear();
            return Convert.ToBase64String(hashedBytes);
        }


        public static User LoadByEmail(string email)
        {
            return Load("SELECT * FROM Users WHERE Email=@Email", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Email", email) });
        }

        public static User LoadByResetGuid(string resetGuid)
        {
            return Load("SELECT * FROM Users WHERE ResetGuid=@ResetGuid", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@ResetGuid", resetGuid) });
        }

        public static User Login(string email, string password)
        {
            string hashedPassword = HashPassword(password);
            return Load("SELECT * FROM Users WHERE Email=@Email AND Password=@Password", CommandType.Text, new MySqlParameter[] {
                new MySqlParameter("@Email", email),
                new MySqlParameter("@Password", hashedPassword)
            });
        }

    }
}
