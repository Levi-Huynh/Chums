 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class GroupMember
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _groupId;
		System.Int32 _personId;
		System.DateTime _joinDate;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isGroupIdNull = true;
		bool _isPersonIdNull = true;
		bool _isJoinDateNull = true;
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
		public System.Int32 GroupId
		{
			get{ return _groupId; }
			set{ _groupId=value; _isGroupIdNull=false; }
		}
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
		}
		public System.DateTime JoinDate
		{
			get{ return _joinDate; }
			set{ _joinDate=value; _isJoinDateNull=false; }
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
		public bool IsGroupIdNull
		{
			get { return _isGroupIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isGroupIdNull = true;
				_groupId = 0;
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
		public bool IsJoinDateNull
		{
			get { return _isJoinDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isJoinDateNull = true;
				_joinDate = DateTime.MinValue;
			}
		}
		#endregion

		#region Constructors
		public GroupMember()
		{
		}

		public GroupMember(DataRow row)
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
			if (row.Table.Columns.Contains("GroupId"))
			{
				if (Convert.IsDBNull(row["GroupId"])) IsGroupIdNull = true;
				else GroupId = Convert.ToInt32(row["GroupId"]);
			}
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
			if (row.Table.Columns.Contains("JoinDate"))
			{
				if (Convert.IsDBNull(row["JoinDate"])) IsJoinDateNull = true;
				else JoinDate = Convert.ToDateTime(row["JoinDate"]);
			}
		}
		#endregion

		#region Methods
		public static GroupMember Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			GroupMembers groupMembers = GroupMembers.Load(sql, commandType, parameters);
			return (groupMembers.Count == 0) ? null : groupMembers[0];
		}

		public static GroupMember Load(int id, int churchId)
		{
			return Load("SELECT * FROM GroupMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO GroupMembers (ChurchId, GroupId, PersonId, JoinDate) VALUES (@ChurchId, @GroupId, @PersonId, @JoinDate); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@JoinDate", (_isJoinDateNull) ? System.DBNull.Value : (object)_joinDate);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE GroupMembers SET ChurchId=@ChurchId, GroupId=@GroupId, PersonId=@PersonId, JoinDate=@JoinDate WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@JoinDate", (_isJoinDateNull) ? System.DBNull.Value : (object)_joinDate);
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
			DbHelper.ExecuteNonQuery("DELETE FROM GroupMembers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(GroupMember).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
