 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Form
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.String _name;
		System.String _contentType;
		System.DateTime _createdTime;
		System.DateTime _modifiedTime;
		System.Boolean _removed;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isNameNull = true;
		bool _isContentTypeNull = true;
		bool _isCreatedTimeNull = true;
		bool _isModifiedTimeNull = true;
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
		public System.String ContentType
		{
			get{ return _contentType; }
			set{ _contentType=value; _isContentTypeNull=false; }
		}
		public System.DateTime CreatedTime
		{
			get{ return _createdTime; }
			set{ _createdTime=value; _isCreatedTimeNull=false; }
		}
		public System.DateTime ModifiedTime
		{
			get{ return _modifiedTime; }
			set{ _modifiedTime=value; _isModifiedTimeNull=false; }
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
		public bool IsContentTypeNull
		{
			get { return _isContentTypeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isContentTypeNull = true;
				_contentType = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsCreatedTimeNull
		{
			get { return _isCreatedTimeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCreatedTimeNull = true;
				_createdTime = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsModifiedTimeNull
		{
			get { return _isModifiedTimeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isModifiedTimeNull = true;
				_modifiedTime = DateTime.MinValue;
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
		public Form()
		{
		}

		public Form(DataRow row)
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
			if (row.Table.Columns.Contains("ContentType"))
			{
				if (Convert.IsDBNull(row["ContentType"])) IsContentTypeNull = true;
				else ContentType = Convert.ToString(row["ContentType"]);
			}
			if (row.Table.Columns.Contains("CreatedTime"))
			{
				if (Convert.IsDBNull(row["CreatedTime"])) IsCreatedTimeNull = true;
				else CreatedTime = Convert.ToDateTime(row["CreatedTime"]);
			}
			if (row.Table.Columns.Contains("ModifiedTime"))
			{
				if (Convert.IsDBNull(row["ModifiedTime"])) IsModifiedTimeNull = true;
				else ModifiedTime = Convert.ToDateTime(row["ModifiedTime"]);
			}
			if (row.Table.Columns.Contains("Removed"))
			{
				if (Convert.IsDBNull(row["Removed"])) IsRemovedNull = true;
				else Removed = Convert.ToBoolean(row["Removed"]);
			}
		}
		#endregion

		#region Methods
		public static Form Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Forms forms = Forms.Load(sql, commandType, parameters);
			return (forms.Count == 0) ? null : forms[0];
		}

		public static Form Load(int id, int churchId)
		{
			return Load("SELECT * FROM Forms WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Forms (ChurchId, Name, ContentType, CreatedTime, ModifiedTime, Removed) VALUES (@ChurchId, @Name, @ContentType, @CreatedTime, @ModifiedTime, @Removed); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@CreatedTime", (_isCreatedTimeNull) ? System.DBNull.Value : (object)_createdTime);
			cmd.Parameters.AddWithValue("@ModifiedTime", (_isModifiedTimeNull) ? System.DBNull.Value : (object)_modifiedTime);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Forms SET ChurchId=@ChurchId, Name=@Name, ContentType=@ContentType, CreatedTime=@CreatedTime, ModifiedTime=@ModifiedTime, Removed=@Removed WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@Name", (_isNameNull) ? System.DBNull.Value : (object)_name);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@CreatedTime", (_isCreatedTimeNull) ? System.DBNull.Value : (object)_createdTime);
			cmd.Parameters.AddWithValue("@ModifiedTime", (_isModifiedTimeNull) ? System.DBNull.Value : (object)_modifiedTime);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Forms WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Form).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
