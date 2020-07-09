 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Note
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.String _contentType;
		System.Int32 _contentId;
		System.String _noteType;
		System.Int32 _addedBy;
		System.DateTime _dateAdded;
		System.String _contents;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isContentTypeNull = true;
		bool _isContentIdNull = true;
		bool _isNoteTypeNull = true;
		bool _isAddedByNull = true;
		bool _isDateAddedNull = true;
		bool _isContentsNull = true;
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
		public System.String ContentType
		{
			get{ return _contentType; }
			set{ _contentType=value; _isContentTypeNull=false; }
		}
		public System.Int32 ContentId
		{
			get{ return _contentId; }
			set{ _contentId=value; _isContentIdNull=false; }
		}
		public System.String NoteType
		{
			get{ return _noteType; }
			set{ _noteType=value; _isNoteTypeNull=false; }
		}
		public System.Int32 AddedBy
		{
			get{ return _addedBy; }
			set{ _addedBy=value; _isAddedByNull=false; }
		}
		public System.DateTime DateAdded
		{
			get{ return _dateAdded; }
			set{ _dateAdded=value; _isDateAddedNull=false; }
		}
		public System.String Contents
		{
			get{ return _contents; }
			set{ _contents=value; _isContentsNull=false; }
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
		public bool IsContentIdNull
		{
			get { return _isContentIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isContentIdNull = true;
				_contentId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsNoteTypeNull
		{
			get { return _isNoteTypeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isNoteTypeNull = true;
				_noteType = System.String.Empty;
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
		public bool IsContentsNull
		{
			get { return _isContentsNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isContentsNull = true;
				_contents = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public Note()
		{
		}

		public Note(DataRow row)
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
			if (row.Table.Columns.Contains("ContentType"))
			{
				if (Convert.IsDBNull(row["ContentType"])) IsContentTypeNull = true;
				else ContentType = Convert.ToString(row["ContentType"]);
			}
			if (row.Table.Columns.Contains("ContentId"))
			{
				if (Convert.IsDBNull(row["ContentId"])) IsContentIdNull = true;
				else ContentId = Convert.ToInt32(row["ContentId"]);
			}
			if (row.Table.Columns.Contains("NoteType"))
			{
				if (Convert.IsDBNull(row["NoteType"])) IsNoteTypeNull = true;
				else NoteType = Convert.ToString(row["NoteType"]);
			}
			if (row.Table.Columns.Contains("AddedBy"))
			{
				if (Convert.IsDBNull(row["AddedBy"])) IsAddedByNull = true;
				else AddedBy = Convert.ToInt32(row["AddedBy"]);
			}
			if (row.Table.Columns.Contains("DateAdded"))
			{
				if (Convert.IsDBNull(row["DateAdded"])) IsDateAddedNull = true;
				else DateAdded = Convert.ToDateTime(row["DateAdded"]);
			}
			if (row.Table.Columns.Contains("Contents"))
			{
				if (Convert.IsDBNull(row["Contents"])) IsContentsNull = true;
				else Contents = Convert.ToString(row["Contents"]);
			}
		}
		#endregion

		#region Methods
		public static Note Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Notes notes = Notes.Load(sql, commandType, parameters);
			return (notes.Count == 0) ? null : notes[0];
		}

		public static Note Load(int id, int churchId)
		{
			return Load("SELECT * FROM Notes WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Notes (ChurchId, ContentType, ContentId, NoteType, AddedBy, DateAdded, Contents) VALUES (@ChurchId, @ContentType, @ContentId, @NoteType, @AddedBy, @DateAdded, @Contents); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@NoteType", (_isNoteTypeNull) ? System.DBNull.Value : (object)_noteType);
			cmd.Parameters.AddWithValue("@AddedBy", (_isAddedByNull) ? System.DBNull.Value : (object)_addedBy);
			cmd.Parameters.AddWithValue("@DateAdded", (_isDateAddedNull) ? System.DBNull.Value : (object)_dateAdded);
			cmd.Parameters.AddWithValue("@Contents", (_isContentsNull) ? System.DBNull.Value : (object)_contents);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Notes SET ChurchId=@ChurchId, ContentType=@ContentType, ContentId=@ContentId, NoteType=@NoteType, AddedBy=@AddedBy, DateAdded=@DateAdded, Contents=@Contents WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@NoteType", (_isNoteTypeNull) ? System.DBNull.Value : (object)_noteType);
			cmd.Parameters.AddWithValue("@AddedBy", (_isAddedByNull) ? System.DBNull.Value : (object)_addedBy);
			cmd.Parameters.AddWithValue("@DateAdded", (_isDateAddedNull) ? System.DBNull.Value : (object)_dateAdded);
			cmd.Parameters.AddWithValue("@Contents", (_isContentsNull) ? System.DBNull.Value : (object)_contents);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Notes WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Note).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
