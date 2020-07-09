 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Question
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _formId;
		System.Int32 _parentId;
		System.String _title;
		System.String _description;
		System.String _fieldType;
		System.String _placeholder;
		System.Int32 _sort;
		System.String _choices;
		System.Boolean _removed;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isFormIdNull = true;
		bool _isParentIdNull = true;
		bool _isTitleNull = true;
		bool _isDescriptionNull = true;
		bool _isFieldTypeNull = true;
		bool _isPlaceholderNull = true;
		bool _isSortNull = true;
		bool _isChoicesNull = true;
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
		public System.Int32 FormId
		{
			get{ return _formId; }
			set{ _formId=value; _isFormIdNull=false; }
		}
		public System.Int32 ParentId
		{
			get{ return _parentId; }
			set{ _parentId=value; _isParentIdNull=false; }
		}
		public System.String Title
		{
			get{ return _title; }
			set{ _title=value; _isTitleNull=false; }
		}
		public System.String Description
		{
			get{ return _description; }
			set{ _description=value; _isDescriptionNull=false; }
		}
		public System.String FieldType
		{
			get{ return _fieldType; }
			set{ _fieldType=value; _isFieldTypeNull=false; }
		}
		public System.String Placeholder
		{
			get{ return _placeholder; }
			set{ _placeholder=value; _isPlaceholderNull=false; }
		}
		public System.Int32 Sort
		{
			get{ return _sort; }
			set{ _sort=value; _isSortNull=false; }
		}
		public System.String Choices
		{
			get{ return _choices; }
			set{ _choices=value; _isChoicesNull=false; }
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
		public bool IsFormIdNull
		{
			get { return _isFormIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isFormIdNull = true;
				_formId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsParentIdNull
		{
			get { return _isParentIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isParentIdNull = true;
				_parentId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsTitleNull
		{
			get { return _isTitleNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isTitleNull = true;
				_title = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsDescriptionNull
		{
			get { return _isDescriptionNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isDescriptionNull = true;
				_description = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsFieldTypeNull
		{
			get { return _isFieldTypeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isFieldTypeNull = true;
				_fieldType = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsPlaceholderNull
		{
			get { return _isPlaceholderNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPlaceholderNull = true;
				_placeholder = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsSortNull
		{
			get { return _isSortNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSortNull = true;
				_sort = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsChoicesNull
		{
			get { return _isChoicesNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isChoicesNull = true;
				_choices = System.String.Empty;
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
		public Question()
		{
		}

		public Question(DataRow row)
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
			if (row.Table.Columns.Contains("FormId"))
			{
				if (Convert.IsDBNull(row["FormId"])) IsFormIdNull = true;
				else FormId = Convert.ToInt32(row["FormId"]);
			}
			if (row.Table.Columns.Contains("ParentId"))
			{
				if (Convert.IsDBNull(row["ParentId"])) IsParentIdNull = true;
				else ParentId = Convert.ToInt32(row["ParentId"]);
			}
			if (row.Table.Columns.Contains("Title"))
			{
				if (Convert.IsDBNull(row["Title"])) IsTitleNull = true;
				else Title = Convert.ToString(row["Title"]);
			}
			if (row.Table.Columns.Contains("Description"))
			{
				if (Convert.IsDBNull(row["Description"])) IsDescriptionNull = true;
				else Description = Convert.ToString(row["Description"]);
			}
			if (row.Table.Columns.Contains("FieldType"))
			{
				if (Convert.IsDBNull(row["FieldType"])) IsFieldTypeNull = true;
				else FieldType = Convert.ToString(row["FieldType"]);
			}
			if (row.Table.Columns.Contains("Placeholder"))
			{
				if (Convert.IsDBNull(row["Placeholder"])) IsPlaceholderNull = true;
				else Placeholder = Convert.ToString(row["Placeholder"]);
			}
			if (row.Table.Columns.Contains("Sort"))
			{
				if (Convert.IsDBNull(row["Sort"])) IsSortNull = true;
				else Sort = Convert.ToInt32(row["Sort"]);
			}
			if (row.Table.Columns.Contains("Choices"))
			{
				if (Convert.IsDBNull(row["Choices"])) IsChoicesNull = true;
				else Choices = Convert.ToString(row["Choices"]);
			}
			if (row.Table.Columns.Contains("Removed"))
			{
				if (Convert.IsDBNull(row["Removed"])) IsRemovedNull = true;
				else Removed = Convert.ToBoolean(row["Removed"]);
			}
		}
		#endregion

		#region Methods
		public static Question Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Questions questions = Questions.Load(sql, commandType, parameters);
			return (questions.Count == 0) ? null : questions[0];
		}

		public static Question Load(int id, int churchId)
		{
			return Load("SELECT * FROM Questions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Questions (ChurchId, FormId, ParentId, Title, Description, FieldType, Placeholder, Sort, Choices, Removed) VALUES (@ChurchId, @FormId, @ParentId, @Title, @Description, @FieldType, @Placeholder, @Sort, @Choices, @Removed); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormId", (_isFormIdNull) ? System.DBNull.Value : (object)_formId);
			cmd.Parameters.AddWithValue("@ParentId", (_isParentIdNull) ? System.DBNull.Value : (object)_parentId);
			cmd.Parameters.AddWithValue("@Title", (_isTitleNull) ? System.DBNull.Value : (object)_title);
			cmd.Parameters.AddWithValue("@Description", (_isDescriptionNull) ? System.DBNull.Value : (object)_description);
			cmd.Parameters.AddWithValue("@FieldType", (_isFieldTypeNull) ? System.DBNull.Value : (object)_fieldType);
			cmd.Parameters.AddWithValue("@Placeholder", (_isPlaceholderNull) ? System.DBNull.Value : (object)_placeholder);
			cmd.Parameters.AddWithValue("@Sort", (_isSortNull) ? System.DBNull.Value : (object)_sort);
			cmd.Parameters.AddWithValue("@Choices", (_isChoicesNull) ? System.DBNull.Value : (object)_choices);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Questions SET ChurchId=@ChurchId, FormId=@FormId, ParentId=@ParentId, Title=@Title, Description=@Description, FieldType=@FieldType, Placeholder=@Placeholder, Sort=@Sort, Choices=@Choices, Removed=@Removed WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormId", (_isFormIdNull) ? System.DBNull.Value : (object)_formId);
			cmd.Parameters.AddWithValue("@ParentId", (_isParentIdNull) ? System.DBNull.Value : (object)_parentId);
			cmd.Parameters.AddWithValue("@Title", (_isTitleNull) ? System.DBNull.Value : (object)_title);
			cmd.Parameters.AddWithValue("@Description", (_isDescriptionNull) ? System.DBNull.Value : (object)_description);
			cmd.Parameters.AddWithValue("@FieldType", (_isFieldTypeNull) ? System.DBNull.Value : (object)_fieldType);
			cmd.Parameters.AddWithValue("@Placeholder", (_isPlaceholderNull) ? System.DBNull.Value : (object)_placeholder);
			cmd.Parameters.AddWithValue("@Sort", (_isSortNull) ? System.DBNull.Value : (object)_sort);
			cmd.Parameters.AddWithValue("@Choices", (_isChoicesNull) ? System.DBNull.Value : (object)_choices);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Questions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Question).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
