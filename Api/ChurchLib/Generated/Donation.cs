 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Donation
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _batchId;
		System.Int32 _personId;
		System.DateTime _donationDate;
		System.Double _amount;
		System.String _method;
		System.String _methodDetails;
		System.String _notes;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isBatchIdNull = true;
		bool _isPersonIdNull = true;
		bool _isDonationDateNull = true;
		bool _isAmountNull = true;
		bool _isMethodNull = true;
		bool _isMethodDetailsNull = true;
		bool _isNotesNull = true;
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
		public System.Int32 BatchId
		{
			get{ return _batchId; }
			set{ _batchId=value; _isBatchIdNull=false; }
		}
		public System.Int32 PersonId
		{
			get{ return _personId; }
			set{ _personId=value; _isPersonIdNull=false; }
		}
		public System.DateTime DonationDate
		{
			get{ return _donationDate; }
			set{ _donationDate=value; _isDonationDateNull=false; }
		}
		public System.Double Amount
		{
			get{ return _amount; }
			set{ _amount=value; _isAmountNull=false; }
		}
		public System.String Method
		{
			get{ return _method; }
			set{ _method=value; _isMethodNull=false; }
		}
		public System.String MethodDetails
		{
			get{ return _methodDetails; }
			set{ _methodDetails=value; _isMethodDetailsNull=false; }
		}
		public System.String Notes
		{
			get{ return _notes; }
			set{ _notes=value; _isNotesNull=false; }
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
		public bool IsBatchIdNull
		{
			get { return _isBatchIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isBatchIdNull = true;
				_batchId = 0;
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
		public bool IsDonationDateNull
		{
			get { return _isDonationDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isDonationDateNull = true;
				_donationDate = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAmountNull
		{
			get { return _isAmountNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAmountNull = true;
				_amount = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMethodNull
		{
			get { return _isMethodNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMethodNull = true;
				_method = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMethodDetailsNull
		{
			get { return _isMethodDetailsNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMethodDetailsNull = true;
				_methodDetails = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsNotesNull
		{
			get { return _isNotesNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isNotesNull = true;
				_notes = System.String.Empty;
			}
		}
		#endregion

		#region Constructors
		public Donation()
		{
		}

		public Donation(DataRow row)
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
			if (row.Table.Columns.Contains("BatchId"))
			{
				if (Convert.IsDBNull(row["BatchId"])) IsBatchIdNull = true;
				else BatchId = Convert.ToInt32(row["BatchId"]);
			}
			if (row.Table.Columns.Contains("PersonId"))
			{
				if (Convert.IsDBNull(row["PersonId"])) IsPersonIdNull = true;
				else PersonId = Convert.ToInt32(row["PersonId"]);
			}
			if (row.Table.Columns.Contains("DonationDate"))
			{
				if (Convert.IsDBNull(row["DonationDate"])) IsDonationDateNull = true;
				else DonationDate = Convert.ToDateTime(row["DonationDate"]);
			}
			if (row.Table.Columns.Contains("Amount"))
			{
				if (Convert.IsDBNull(row["Amount"])) IsAmountNull = true;
				else Amount = Convert.ToDouble(row["Amount"]);
			}
			if (row.Table.Columns.Contains("Method"))
			{
				if (Convert.IsDBNull(row["Method"])) IsMethodNull = true;
				else Method = Convert.ToString(row["Method"]);
			}
			if (row.Table.Columns.Contains("MethodDetails"))
			{
				if (Convert.IsDBNull(row["MethodDetails"])) IsMethodDetailsNull = true;
				else MethodDetails = Convert.ToString(row["MethodDetails"]);
			}
			if (row.Table.Columns.Contains("Notes"))
			{
				if (Convert.IsDBNull(row["Notes"])) IsNotesNull = true;
				else Notes = Convert.ToString(row["Notes"]);
			}
		}
		#endregion

		#region Methods
		public static Donation Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			Donations donations = Donations.Load(sql, commandType, parameters);
			return (donations.Count == 0) ? null : donations[0];
		}

		public static Donation Load(int id, int churchId)
		{
			return Load("SELECT * FROM Donations WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO Donations (ChurchId, BatchId, PersonId, DonationDate, Amount, Method, MethodDetails, Notes) VALUES (@ChurchId, @BatchId, @PersonId, @DonationDate, @Amount, @Method, @MethodDetails, @Notes); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@BatchId", (_isBatchIdNull) ? System.DBNull.Value : (object)_batchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@DonationDate", (_isDonationDateNull) ? System.DBNull.Value : (object)_donationDate);
			cmd.Parameters.AddWithValue("@Amount", (_isAmountNull) ? System.DBNull.Value : (object)_amount);
			cmd.Parameters.AddWithValue("@Method", (_isMethodNull) ? System.DBNull.Value : (object)_method);
			cmd.Parameters.AddWithValue("@MethodDetails", (_isMethodDetailsNull) ? System.DBNull.Value : (object)_methodDetails);
			cmd.Parameters.AddWithValue("@Notes", (_isNotesNull) ? System.DBNull.Value : (object)_notes);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE Donations SET ChurchId=@ChurchId, BatchId=@BatchId, PersonId=@PersonId, DonationDate=@DonationDate, Amount=@Amount, Method=@Method, MethodDetails=@MethodDetails, Notes=@Notes WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@BatchId", (_isBatchIdNull) ? System.DBNull.Value : (object)_batchId);
			cmd.Parameters.AddWithValue("@PersonId", (_isPersonIdNull) ? System.DBNull.Value : (object)_personId);
			cmd.Parameters.AddWithValue("@DonationDate", (_isDonationDateNull) ? System.DBNull.Value : (object)_donationDate);
			cmd.Parameters.AddWithValue("@Amount", (_isAmountNull) ? System.DBNull.Value : (object)_amount);
			cmd.Parameters.AddWithValue("@Method", (_isMethodNull) ? System.DBNull.Value : (object)_method);
			cmd.Parameters.AddWithValue("@MethodDetails", (_isMethodDetailsNull) ? System.DBNull.Value : (object)_methodDetails);
			cmd.Parameters.AddWithValue("@Notes", (_isNotesNull) ? System.DBNull.Value : (object)_notes);
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
			DbHelper.ExecuteNonQuery("DELETE FROM Donations WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Donation).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
