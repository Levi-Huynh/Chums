using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public class AppSettings
    {
        private static AppSettings _current;

        public static AppSettings Current
        {
            get
            {
                if (_current == null) _current = new AppSettings();
                return _current;
            }
        }

        public string ChurchConnectionString { get; set; }

        public string AwsKey { get; set; }
        public string AwsSecret { get; set; }
        public string S3ContentBucket { get; set; }

    }
}
