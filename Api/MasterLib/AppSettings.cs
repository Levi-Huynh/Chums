using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterLib
{
    public class AppSettings
    {
        private static AppSettings _current;

        public static AppSettings Current {
            get
            {
                if (_current == null) _current = new AppSettings();
                return _current;
            }
        }

        public string MasterConnectionString { get; set; }
        public string PasswordSalt { get; set; }
    }
}
