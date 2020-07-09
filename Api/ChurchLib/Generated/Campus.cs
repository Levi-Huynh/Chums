 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Campus
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.String _name;
		System.String _address1;
		System.String _address2;
		System.String _city;
		System.String _state;
		System.String _zip;
		System.Boolean _removed;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isNameNull = true;
		bool _isAddress1Null = true;
		bool _isAddress2Null = true;
		bool _isCityNull = true;
		bool _isStateNull = true;
		bool _isZipNull = true;
		bool _isRemovedNull = true;
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
		public System.String Address1
		{
			get{ return _address1; }
			set{ _address1=value; _isAddress1Null=false; }
		}
		public System.String Address2
		{
			get{ return _address2; }
			set{ _address2=value; _isAddress2Null=false; }
		}
		public System.String City
		{
			get{ return _city; }
			set{ _city=value; _isCityNull=false; }
		}
		public System.String State
		{
			get{ return _state; }
			set{ _state=value; _isStateNull=false; }
		}
		public System.String Zip
		{
			get{ return _zip; }
			set{ _zip=value; _isZipNull=false; }
		}
		public System.Boolean Removed
		{
			get{ return _removed; }
			set{ _removed=value; _isRemovedNull=false; }
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
		public bool IsAddress1Null
		{
			get { return _isAddress1Null; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAddress1Null = true;
				_address1 = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAddress2Null
		{
			get { return _isAddress2Null; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAddress2Null = true;
				_address2 = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsCityNull
		{
			get { return _isCityNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCityNull = true;
				_city = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsStateNull
		{
			get { return _isStateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isStateNull = true;
				_state = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsZipNull
		{
			get { return _isZipNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isZipNull = true;
				_zip = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsRemovedNull
		{
			get { return _isRemovedNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRemovedNull = true;
				_removed = false;
			}
		}
		#endregion

		#region Constructors
		public Campus()
		{
		}

		public Campus(DataRow row)
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
			if (row.Table.Columns.Contains("Address1"))
			{
				if (Convert.IsDBNull(row["Address1"])) IsAddress1Null = true;
				else Address1 = Convert.ToString(row["Address1"]);
			}
			if (row.Table.Columns.Contains("Address2"))
			{
				if (Convert.IsDBNull(row["Address2"])) IsAddress2Null = true;
				else Address2 = Convert.ToString(row["Address2"]);
			}
			if (row.Table.Columns.Contains("City"))
			{
				if (Convert.IsDBNull(row["City"])) IsCityNull = true;
				else City = Convert.ToString(row["City"]);
			}
			if (row.Table.Columns.Contains("State"))
			{
				if (Convert.IsDBNull(row["State"])) IsStateNull = true;
				else State = Convert.ToString(row["State"]);
			}
			if (row.Table.Columns.Contains("Zip"))
			{
				if (Convert.IsDBNull(row["Zip"])) IsZipNull = true;
				else Zip = Convert.ToString(row["Zip"]);
			}
			if (row.Table.Columns.Contains("Removed"))
			{
				if (Convert.IsDBNull(row["Removed"])) IsRemovedNull = true;
				else Removed = Convert.ToBoolean(row["Removed"]);
			}
		}
		#endregion

		#region Methods
		public static Campus Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Campuses campuses = Campuses.Load(sql, commandType, parameters);
			return (campuses.Count == 0) ? null : campuses[0];
		}

		public static Campus Load(int id, int churchId)
		{
			return Load("SELECT * FROM Campuses WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Campuses (ChurchId, Name, Address1, Address2, City, State, Zip, Removed) VALUES (@ChurchId, @Name, @Address1, @Address2, @City, @State, @Zip, @Removed); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@Address1", (_isAddress1Null) ? System.DBNull.Value : (object)_address1);
			cmd.Parameters.AddWithValue("@Address2", (_isAddress2Null) ? System.DBNull.Value : (object)_address2);
			cmd.Parameters.AddWithValue("@City", (_isCityNull) ? System.DBNull.Value : (object)_city);
			cmd.Parameters.AddWithValue("@State", (_isStateNull) ? System.DBNull.Value : (object)_state);
			cmd.Parameters.AddWithValue("@Zip", (_isZipNull) ? System.DBNull.Value : (object)_zip);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Campuses SET ChurchId=@ChurchId, Name=@Name, Address1=@Address1, Address2=@Address2, City=@City, State=@State, Zip=@Zip, Removed=@Removed WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@Address1", (_isAddress1Null) ? System.DBNull.Value : (object)_address1);
			cmd.Parameters.AddWithValue("@Address2", (_isAddress2Null) ? System.DBNull.Value : (object)_address2);
			cmd.Parameters.AddWithValue("@City", (_isCityNull) ? System.DBNull.Value : (object)_city);
			cmd.Parameters.AddWithValue("@State", (_isStateNull) ? System.DBNull.Value : (object)_state);
			cmd.Parameters.AddWithValue("@Zip", (_isZipNull) ? System.DBNull.Value : (object)_zip);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Campuses WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Campus).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
