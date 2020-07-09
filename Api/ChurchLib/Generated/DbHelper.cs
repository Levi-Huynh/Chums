
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using MySql.Data.MySqlClient;
using MySql.Data.MySqlClient;

namespace ChurchLib
{
    public partial class DbHelper
    {
        public static string ConnectionString { get; set; } = AppSettings.Current.ChurchConnectionString;
        
        public static MySqlConnection Connection
        {
            get { return new MySqlConnection(ConnectionString); }
        }

        public static void BulkInsert(DataTable dt, string tableName)
        {
            //unused.  to be removed
        }

        public static DataTable FillDt(string sql)
        {
            MySqlDataAdapter adapter = new MySqlDataAdapter(sql, Connection);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            return dt;
        }

        public static DataTable ExecuteQuery(string sql, System.Data.CommandType commandType, MySqlParameter[] parameters)
        {
            MySqlDataAdapter adapter = new MySqlDataAdapter(sql, Connection);
            adapter.SelectCommand.CommandType = commandType;
            if (parameters != null)
            {
                foreach (MySqlParameter parameter in parameters) adapter.SelectCommand.Parameters.Add(parameter);
            }
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            return dt;
        }


        public static Object ExecuteScalar(string sql, System.Data.CommandType commandType, MySqlParameter[] parameters)
        {
            object result = null;
            MySqlCommand cmd = new MySqlCommand(sql, Connection);
            cmd.CommandType = commandType;
            if (parameters != null) foreach (MySqlParameter parameter in parameters) cmd.Parameters.Add(parameter);
            try
            {
                cmd.Connection.Open();
                result = cmd.ExecuteScalar();
            }
            finally { cmd.Connection.Close(); }
            return result;
        }

        public static void ExecuteNonQuery(string sql, System.Data.CommandType commandType, MySqlParameter[] parameters)
        {
            MySqlCommand cmd = new MySqlCommand(sql, Connection);
            cmd.CommandType = commandType;
            if (parameters != null) foreach (MySqlParameter parameter in parameters) cmd.Parameters.Add(parameter);
            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
            }
            finally { cmd.Connection.Close(); }
        }

        public static void SetContextInfo(MySqlConnection con)
        {
        }

    }
}
