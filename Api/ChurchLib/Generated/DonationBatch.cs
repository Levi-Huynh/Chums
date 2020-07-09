 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class DonationBatch
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.String _name;
		System.DateTime _batchDate;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isNameNull = true;
		bool _isBatchDateNull = true;
		#endregion

		#region Properties
		public System.Int32 Id
		{
			get{ return _id; }
			set{ _id=value; _isIdNull=false; }
		}
		public System.Int32 ChurchId
		{
			get{ return _churchId; }
			set{ _churchId=value; _isChurchIdNull=false; }
		}
		public System.String Name
		{
			get{ return _name; }
			set{ _name=value; _isNameNull=false; }
		}
		public System.DateTime BatchDate
		{
			get{ return _batchDate; }
			set{ _batchDate=value; _isBatchDateNull=false; }
		}
		[XmlIgnoreAttribute]
		public bool IsIdNull
		{
			get { return _isIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isIdNull = true;
				_id = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsChurchIdNull
		{
			get { return _isChurchIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isChurchIdNull = true;
				_churchId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsNameNull
		{
			get { return _isNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isNameNull = true;
				_name = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsBatchDateNull
		{
			get { return _isBatchDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isBatchDateNull = true;
				_batchDate = DateTime.MinValue;
			}
		}
		#endregion

		#region Constructors
		public DonationBatch()
		{
		}

		public DonationBatch(DataRow row)
		{
			if (row.Table.Columns.Contains("Id"))
			{
				if (Convert.IsDBNull(row["Id"])) IsIdNull = true;
				else Id = Convert.ToInt32(row["Id"]);
			}
			if (row.Table.Columns.Contains("ChurchId"))
			{
				if (Convert.IsDBNull(row["ChurchId"])) IsChurchIdNull = true;
				else ChurchId = Convert.ToInt32(row["ChurchId"]);
			}
			if (row.Table.Columns.Contains("Name"))
			{
				if (Convert.IsDBNull(row["Name"])) IsNameNull = true;
				else Name = Convert.ToString(row["Name"]);
			}
			if (row.Table.Columns.Contains("BatchDate"))
			{
				if (Convert.IsDBNull(row["BatchDate"])) IsBatchDateNull = true;
				else BatchDate = Convert.ToDateTime(row["BatchDate"]);
			}
		}
		#endregion

		#region Methods
		public static DonationBatch Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			DonationBatches donationBatches = DonationBatches.Load(sql, commandType, parameters);
			return (donationBatches.Count == 0) ? null : donationBatches[0];
		}

		public static DonationBatch Load(int id, int churchId)
		{
			return Load("SELECT * FROM DonationBatches WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO DonationBatches (ChurchId, Name, BatchDate) VALUES (@ChurchId, @Name, @BatchDate); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@BatchDate", (_isBatchDateNull) ? System.DBNull.Value : (object)_batchDate);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE DonationBatches SET ChurchId=@ChurchId, Name=@Name, BatchDate=@BatchDate WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@BatchDate", (_isBatchDateNull) ? System.DBNull.Value : (object)_batchDate);
			return cmd;
		}

		public int Save()
		{
			MySqlCommand cmd = GetSaveCommand(DbHelper.Connection);
			cmd.Connection.Open();
			try
			{
				DbHelper.SetContextInfo(cmd.Connection);
				Id = Convert.ToInt32(cmd.ExecuteScalar());
			}
			catch (Exception ex) { throw ex; }
			finally { cmd.Connection.Close(); }
			return Id;
		}

		public static void Delete(int id, int churchId)
		{
			DbHelper.ExecuteNonQuery("DELETE FROM DonationBatches WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(DonationBatch).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
