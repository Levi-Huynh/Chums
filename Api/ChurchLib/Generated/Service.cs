 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Service
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _campusId;
		System.String _name;
		System.Boolean _removed;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isCampusIdNull = true;
		bool _isNameNull = true;
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
		public System.Int32 CampusId
		{
			get{ return _campusId; }
			set{ _campusId=value; _isCampusIdNull=false; }
		}
		public System.String Name
		{
			get{ return _name; }
			set{ _name=value; _isNameNull=false; }
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
		public bool IsCampusIdNull
		{
			get { return _isCampusIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCampusIdNull = true;
				_campusId = 0;
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
		public Service()
		{
		}

		public Service(DataRow row)
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
			if (row.Table.Columns.Contains("CampusId"))
			{
				if (Convert.IsDBNull(row["CampusId"])) IsCampusIdNull = true;
				else CampusId = Convert.ToInt32(row["CampusId"]);
			}
			if (row.Table.Columns.Contains("Name"))
			{
				if (Convert.IsDBNull(row["Name"])) IsNameNull = true;
				else Name = Convert.ToString(row["Name"]);
			}
			if (row.Table.Columns.Contains("Removed"))
			{
				if (Convert.IsDBNull(row["Removed"])) IsRemovedNull = true;
				else Removed = Convert.ToBoolean(row["Removed"]);
			}
		}
		#endregion

		#region Methods
		public static Service Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Services services = Services.Load(sql, commandType, parameters);
			return (services.Count == 0) ? null : services[0];
		}

		public static Service Load(int id, int churchId)
		{
			return Load("SELECT * FROM Services WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Services (ChurchId, CampusId, Name, Removed) VALUES (@ChurchId, @CampusId, @Name, @Removed); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@CampusId", (_isCampusIdNull) ? System.DBNull.Value : (object)_campusId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Services SET ChurchId=@ChurchId, CampusId=@CampusId, Name=@Name, Removed=@Removed WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@CampusId", (_isCampusIdNull) ? System.DBNull.Value : (object)_campusId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Services WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Service).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
