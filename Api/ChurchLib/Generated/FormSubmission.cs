 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class FormSubmission
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _formId;
		System.String _contentType;
		System.Int32 _contentId;
		System.DateTime _submissionDate;
		System.Int32 _submittedBy;
		System.DateTime _revisionDate;
		System.Int32 _revisedBy;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isFormIdNull = true;
		bool _isContentTypeNull = true;
		bool _isContentIdNull = true;
		bool _isSubmissionDateNull = true;
		bool _isSubmittedByNull = true;
		bool _isRevisionDateNull = true;
		bool _isRevisedByNull = true;
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
		public System.DateTime SubmissionDate
		{
			get{ return _submissionDate; }
			set{ _submissionDate=value; _isSubmissionDateNull=false; }
		}
		public System.Int32 SubmittedBy
		{
			get{ return _submittedBy; }
			set{ _submittedBy=value; _isSubmittedByNull=false; }
		}
		public System.DateTime RevisionDate
		{
			get{ return _revisionDate; }
			set{ _revisionDate=value; _isRevisionDateNull=false; }
		}
		public System.Int32 RevisedBy
		{
			get{ return _revisedBy; }
			set{ _revisedBy=value; _isRevisedByNull=false; }
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
		public bool IsSubmissionDateNull
		{
			get { return _isSubmissionDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSubmissionDateNull = true;
				_submissionDate = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsSubmittedByNull
		{
			get { return _isSubmittedByNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSubmittedByNull = true;
				_submittedBy = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsRevisionDateNull
		{
			get { return _isRevisionDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRevisionDateNull = true;
				_revisionDate = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsRevisedByNull
		{
			get { return _isRevisedByNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isRevisedByNull = true;
				_revisedBy = 0;
			}
		}
		#endregion

		#region Constructors
		public FormSubmission()
		{
		}

		public FormSubmission(DataRow row)
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
			if (row.Table.Columns.Contains("SubmissionDate"))
			{
				if (Convert.IsDBNull(row["SubmissionDate"])) IsSubmissionDateNull = true;
				else SubmissionDate = Convert.ToDateTime(row["SubmissionDate"]);
			}
			if (row.Table.Columns.Contains("SubmittedBy"))
			{
				if (Convert.IsDBNull(row["SubmittedBy"])) IsSubmittedByNull = true;
				else SubmittedBy = Convert.ToInt32(row["SubmittedBy"]);
			}
			if (row.Table.Columns.Contains("RevisionDate"))
			{
				if (Convert.IsDBNull(row["RevisionDate"])) IsRevisionDateNull = true;
				else RevisionDate = Convert.ToDateTime(row["RevisionDate"]);
			}
			if (row.Table.Columns.Contains("RevisedBy"))
			{
				if (Convert.IsDBNull(row["RevisedBy"])) IsRevisedByNull = true;
				else RevisedBy = Convert.ToInt32(row["RevisedBy"]);
			}
		}
		#endregion

		#region Methods
		public static FormSubmission Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			FormSubmissions formSubmissions = FormSubmissions.Load(sql, commandType, parameters);
			return (formSubmissions.Count == 0) ? null : formSubmissions[0];
		}

		public static FormSubmission Load(int id, int churchId)
		{
			return Load("SELECT * FROM FormSubmissions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO FormSubmissions (ChurchId, FormId, ContentType, ContentId, SubmissionDate, SubmittedBy, RevisionDate, RevisedBy) VALUES (@ChurchId, @FormId, @ContentType, @ContentId, @SubmissionDate, @SubmittedBy, @RevisionDate, @RevisedBy); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormId", (_isFormIdNull) ? System.DBNull.Value : (object)_formId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@SubmissionDate", (_isSubmissionDateNull) ? System.DBNull.Value : (object)_submissionDate);
			cmd.Parameters.AddWithValue("@SubmittedBy", (_isSubmittedByNull) ? System.DBNull.Value : (object)_submittedBy);
			cmd.Parameters.AddWithValue("@RevisionDate", (_isRevisionDateNull) ? System.DBNull.Value : (object)_revisionDate);
			cmd.Parameters.AddWithValue("@RevisedBy", (_isRevisedByNull) ? System.DBNull.Value : (object)_revisedBy);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE FormSubmissions SET ChurchId=@ChurchId, FormId=@FormId, ContentType=@ContentType, ContentId=@ContentId, SubmissionDate=@SubmissionDate, SubmittedBy=@SubmittedBy, RevisionDate=@RevisionDate, RevisedBy=@RevisedBy WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormId", (_isFormIdNull) ? System.DBNull.Value : (object)_formId);
			cmd.Parameters.AddWithValue("@ContentType", (_isContentTypeNull) ? System.DBNull.Value : (object)_contentType);
			cmd.Parameters.AddWithValue("@ContentId", (_isContentIdNull) ? System.DBNull.Value : (object)_contentId);
			cmd.Parameters.AddWithValue("@SubmissionDate", (_isSubmissionDateNull) ? System.DBNull.Value : (object)_submissionDate);
			cmd.Parameters.AddWithValue("@SubmittedBy", (_isSubmittedByNull) ? System.DBNull.Value : (object)_submittedBy);
			cmd.Parameters.AddWithValue("@RevisionDate", (_isRevisionDateNull) ? System.DBNull.Value : (object)_revisionDate);
			cmd.Parameters.AddWithValue("@RevisedBy", (_isRevisedByNull) ? System.DBNull.Value : (object)_revisedBy);
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
			DbHelper.ExecuteNonQuery("DELETE FROM FormSubmissions WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(FormSubmission).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
