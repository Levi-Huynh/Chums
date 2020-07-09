 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class HouseholdMember
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _householdId;
		System.Int32 _personId;
		System.String _role;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isHouseholdIdNull = true;
		bool _isPersonIdNull = true;
		bool _isRoleNull = true;
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
		public System.Int32 HouseholdId
		{
			get{ return _householdId; }
			set{ _householdId=value; _isHouseholdIdNull=false; }
		}
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
		}
		public System.String Role
		{
			get{ return _role; }
			set{ _role=value; _isRoleNull=false; }
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
		public bool IsHouseholdIdNull
		{
			get { return _isHouseholdIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isHouseholdIdNull = true;
				_householdId = 0;
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
		public bool IsRoleNull
		{
			get { return _isRoleNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRoleNull = true;
				_role = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public HouseholdMember()
		{
		}

		public HouseholdMember(DataRow row)
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
			if (row.Table.Columns.Contains("HouseholdId"))
			{
				if (Convert.IsDBNull(row["HouseholdId"])) IsHouseholdIdNull = true;
				else HouseholdId = Convert.ToInt32(row["HouseholdId"]);
			}
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
			if (row.Table.Columns.Contains("Role"))
			{
				if (Convert.IsDBNull(row["Role"])) IsRoleNull = true;
				else Role = Convert.ToString(row["Role"]);
			}
		}
		#endregion

		#region Methods
		public static HouseholdMember Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			HouseholdMembers householdMembers = HouseholdMembers.Load(sql, commandType, parameters);
			return (householdMembers.Count == 0) ? null : householdMembers[0];
		}

		public static HouseholdMember Load(int id, int churchId)
		{
			return Load("SELECT * FROM HouseholdMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO HouseholdMembers (ChurchId, HouseholdId, PersonId, Role) VALUES (@ChurchId, @HouseholdId, @PersonId, @Role); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@HouseholdId", (_isHouseholdIdNull) ? System.DBNull.Value : (object)_householdId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@Role", (_isRoleNull) ? System.DBNull.Value : (object)_role);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE HouseholdMembers SET ChurchId=@ChurchId, HouseholdId=@HouseholdId, PersonId=@PersonId, Role=@Role WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@HouseholdId", (_isHouseholdIdNull) ? System.DBNull.Value : (object)_householdId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@Role", (_isRoleNull) ? System.DBNull.Value : (object)_role);
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
			DbHelper.ExecuteNonQuery("DELETE FROM HouseholdMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(HouseholdMember).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
