 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Answer
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _formSubmissionId;
		System.Int32 _questionId;
		System.String _value;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isFormSubmissionIdNull = true;
		bool _isQuestionIdNull = true;
		bool _isValueNull = true;
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
		public System.Int32 FormSubmissionId
		{
			get{ return _formSubmissionId; }
			set{ _formSubmissionId=value; _isFormSubmissionIdNull=false; }
		}
		public System.Int32 QuestionId
		{
			get{ return _questionId; }
			set{ _questionId=value; _isQuestionIdNull=false; }
		}
		public System.String Value
		{
			get{ return _value; }
			set{ _value=value; _isValueNull=false; }
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
		public bool IsFormSubmissionIdNull
		{
			get { return _isFormSubmissionIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isFormSubmissionIdNull = true;
				_formSubmissionId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsQuestionIdNull
		{
			get { return _isQuestionIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isQuestionIdNull = true;
				_questionId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsValueNull
		{
			get { return _isValueNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isValueNull = true;
				_value = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public Answer()
		{
		}

		public Answer(DataRow row)
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
			if (row.Table.Columns.Contains("FormSubmissionId"))
			{
				if (Convert.IsDBNull(row["FormSubmissionId"])) IsFormSubmissionIdNull = true;
				else FormSubmissionId = Convert.ToInt32(row["FormSubmissionId"]);
			}
			if (row.Table.Columns.Contains("QuestionId"))
			{
				if (Convert.IsDBNull(row["QuestionId"])) IsQuestionIdNull = true;
				else QuestionId = Convert.ToInt32(row["QuestionId"]);
			}
			if (row.Table.Columns.Contains("Value"))
			{
				if (Convert.IsDBNull(row["Value"])) IsValueNull = true;
				else Value = Convert.ToString(row["Value"]);
			}
		}
		#endregion

		#region Methods
		public static Answer Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Answers answers = Answers.Load(sql, commandType, parameters);
			return (answers.Count == 0) ? null : answers[0];
		}

		public static Answer Load(int id, int churchId)
		{
			return Load("SELECT * FROM Answers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Answers (ChurchId, FormSubmissionId, QuestionId, Value) VALUES (@ChurchId, @FormSubmissionId, @QuestionId, @Value); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormSubmissionId", (_isFormSubmissionIdNull) ? System.DBNull.Value : (object)_formSubmissionId);
			cmd.Parameters.AddWithValue("@QuestionId", (_isQuestionIdNull) ? System.DBNull.Value : (object)_questionId);
			cmd.Parameters.AddWithValue("@Value", (_isValueNull) ? System.DBNull.Value : (object)_value);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Answers SET ChurchId=@ChurchId, FormSubmissionId=@FormSubmissionId, QuestionId=@QuestionId, Value=@Value WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@FormSubmissionId", (_isFormSubmissionIdNull) ? System.DBNull.Value : (object)_formSubmissionId);
			cmd.Parameters.AddWithValue("@QuestionId", (_isQuestionIdNull) ? System.DBNull.Value : (object)_questionId);
			cmd.Parameters.AddWithValue("@Value", (_isValueNull) ? System.DBNull.Value : (object)_value);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Answers WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Answer).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
