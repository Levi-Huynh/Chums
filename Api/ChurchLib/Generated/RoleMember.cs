 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class RoleMember
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _roleId;
		System.Int32 _personId;
		System.DateTime _dateAdded;
		System.Int32 _addedBy;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isRoleIdNull = true;
		bool _isPersonIdNull = true;
		bool _isDateAddedNull = true;
		bool _isAddedByNull = true;
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
		public System.Int32 RoleId
		{
			get{ return _roleId; }
			set{ _roleId=value; _isRoleIdNull=false; }
		}
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
		}
		public System.DateTime DateAdded
		{
			get{ return _dateAdded; }
			set{ _dateAdded=value; _isDateAddedNull=false; }
		}
		public System.Int32 AddedBy
		{
			get{ return _addedBy; }
			set{ _addedBy=value; _isAddedByNull=false; }
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
		public bool IsRoleIdNull
		{
			get { return _isRoleIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRoleIdNull = true;
				_roleId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsPersonIdNull
		{
			get { return _isPersonIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPersonIdNull = true;
				_personId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsDateAddedNull
		{
			get { return _isDateAddedNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isDateAddedNull = true;
				_dateAdded = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAddedByNull
		{
			get { return _isAddedByNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAddedByNull = true;
				_addedBy = 0;
			}
		}
		#endregion

		#region Constructors
		public RoleMember()
		{
		}

		public RoleMember(DataRow row)
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
			if (row.Table.Columns.Contains("RoleId"))
			{
				if (Convert.IsDBNull(row["RoleId"])) IsRoleIdNull = true;
				else RoleId = Convert.ToInt32(row["RoleId"]);
			}
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
			if (row.Table.Columns.Contains("DateAdded"))
			{
				if (Convert.IsDBNull(row["DateAdded"])) IsDateAddedNull = true;
				else DateAdded = Convert.ToDateTime(row["DateAdded"]);
			}
			if (row.Table.Columns.Contains("AddedBy"))
			{
				if (Convert.IsDBNull(row["AddedBy"])) IsAddedByNull = true;
				else AddedBy = Convert.ToInt32(row["AddedBy"]);
			}
		}
		#endregion

		#region Methods
		public static RoleMember Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			RoleMembers roleMembers = RoleMembers.Load(sql, commandType, parameters);
			return (roleMembers.Count == 0) ? null : roleMembers[0];
		}

		public static RoleMember Load(int id, int churchId)
		{
			return Load("SELECT * FROM RoleMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO RoleMembers (ChurchId, RoleId, PersonId, DateAdded, AddedBy) VALUES (@ChurchId, @RoleId, @PersonId, @DateAdded, @AddedBy); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@RoleId", (_isRoleIdNull) ? System.DBNull.Value : (object)_roleId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@DateAdded", (_isDateAddedNull) ? System.DBNull.Value : (object)_dateAdded);
			cmd.Parameters.AddWithValue("@AddedBy", (_isAddedByNull) ? System.DBNull.Value : (object)_addedBy);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE RoleMembers SET ChurchId=@ChurchId, RoleId=@RoleId, PersonId=@PersonId, DateAdded=@DateAdded, AddedBy=@AddedBy WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@RoleId", (_isRoleIdNull) ? System.DBNull.Value : (object)_roleId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@DateAdded", (_isDateAddedNull) ? System.DBNull.Value : (object)_dateAdded);
			cmd.Parameters.AddWithValue("@AddedBy", (_isAddedByNull) ? System.DBNull.Value : (object)_addedBy);
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
			DbHelper.ExecuteNonQuery("DELETE FROM RoleMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(RoleMember).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
