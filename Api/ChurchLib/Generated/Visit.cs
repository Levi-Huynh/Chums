 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Visit
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _personId;
		System.Int32 _serviceId;
		System.Int32 _groupId;
		System.DateTime _visitDate;
		System.DateTime _checkinTime;
		System.Int32 _addedBy;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isPersonIdNull = true;
		bool _isServiceIdNull = true;
		bool _isGroupIdNull = true;
		bool _isVisitDateNull = true;
		bool _isCheckinTimeNull = true;
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
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
		}
		public System.Int32 ServiceId
		{
			get{ return _serviceId; }
			set{ _serviceId=value; _isServiceIdNull=false; }
		}
		public System.Int32 GroupId
		{
			get{ return _groupId; }
			set{ _groupId=value; _isGroupIdNull=false; }
		}
		public System.DateTime VisitDate
		{
			get{ return _visitDate; }
			set{ _visitDate=value; _isVisitDateNull=false; }
		}
		public System.DateTime CheckinTime
		{
			get{ return _checkinTime; }
			set{ _checkinTime=value; _isCheckinTimeNull=false; }
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
		public bool IsServiceIdNull
		{
			get { return _isServiceIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isServiceIdNull = true;
				_serviceId = 0;
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
		public bool IsVisitDateNull
		{
			get { return _isVisitDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isVisitDateNull = true;
				_visitDate = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsCheckinTimeNull
		{
			get { return _isCheckinTimeNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCheckinTimeNull = true;
				_checkinTime = DateTime.MinValue;
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
		public Visit()
		{
		}

		public Visit(DataRow row)
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
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
			if (row.Table.Columns.Contains("ServiceId"))
			{
				if (Convert.IsDBNull(row["ServiceId"])) IsServiceIdNull = true;
				else ServiceId = Convert.ToInt32(row["ServiceId"]);
			}
			if (row.Table.Columns.Contains("GroupId"))
			{
				if (Convert.IsDBNull(row["GroupId"])) IsGroupIdNull = true;
				else GroupId = Convert.ToInt32(row["GroupId"]);
			}
			if (row.Table.Columns.Contains("VisitDate"))
			{
				if (Convert.IsDBNull(row["VisitDate"])) IsVisitDateNull = true;
				else VisitDate = Convert.ToDateTime(row["VisitDate"]);
			}
			if (row.Table.Columns.Contains("CheckinTime"))
			{
				if (Convert.IsDBNull(row["CheckinTime"])) IsCheckinTimeNull = true;
				else CheckinTime = Convert.ToDateTime(row["CheckinTime"]);
			}
			if (row.Table.Columns.Contains("AddedBy"))
			{
				if (Convert.IsDBNull(row["AddedBy"])) IsAddedByNull = true;
				else AddedBy = Convert.ToInt32(row["AddedBy"]);
			}
		}
		#endregion

		#region Methods
		public static Visit Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Visits visits = Visits.Load(sql, commandType, parameters);
			return (visits.Count == 0) ? null : visits[0];
		}

		public static Visit Load(int id, int churchId)
		{
			return Load("SELECT * FROM Visits WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Visits (ChurchId, PersonId, ServiceId, GroupId, VisitDate, CheckinTime, AddedBy) VALUES (@ChurchId, @PersonId, @ServiceId, @GroupId, @VisitDate, @CheckinTime, @AddedBy); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@ServiceId", (_isServiceIdNull) ? System.DBNull.Value : (object)_serviceId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@VisitDate", (_isVisitDateNull) ? System.DBNull.Value : (object)_visitDate);
			cmd.Parameters.AddWithValue("@CheckinTime", (_isCheckinTimeNull) ? System.DBNull.Value : (object)_checkinTime);
			cmd.Parameters.AddWithValue("@AddedBy", (_isAddedByNull) ? System.DBNull.Value : (object)_addedBy);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Visits SET ChurchId=@ChurchId, PersonId=@PersonId, ServiceId=@ServiceId, GroupId=@GroupId, VisitDate=@VisitDate, CheckinTime=@CheckinTime, AddedBy=@AddedBy WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@ServiceId", (_isServiceIdNull) ? System.DBNull.Value : (object)_serviceId);
			cmd.Parameters.AddWithValue("@GroupId", (_isGroupIdNull) ? System.DBNull.Value : (object)_groupId);
			cmd.Parameters.AddWithValue("@VisitDate", (_isVisitDateNull) ? System.DBNull.Value : (object)_visitDate);
			cmd.Parameters.AddWithValue("@CheckinTime", (_isCheckinTimeNull) ? System.DBNull.Value : (object)_checkinTime);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Visits WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Visit).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
