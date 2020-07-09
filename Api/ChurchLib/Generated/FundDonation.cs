 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class FundDonation
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _donationId;
		System.Int32 _fundId;
		System.Double _amount;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isDonationIdNull = true;
		bool _isFundIdNull = true;
		bool _isAmountNull = true;
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
		public System.Int32 DonationId
		{
			get{ return _donationId; }
			set{ _donationId=value; _isDonationIdNull=false; }
		}
		public System.Int32 FundId
		{
			get{ return _fundId; }
			set{ _fundId=value; _isFundIdNull=false; }
		}
		public System.Double Amount
		{
			get{ return _amount; }
			set{ _amount=value; _isAmountNull=false; }
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
		public bool IsDonationIdNull
		{
			get { return _isDonationIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isDonationIdNull = true;
				_donationId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsFundIdNull
		{
			get { return _isFundIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isFundIdNull = true;
				_fundId = 0;
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
		#endregion

		#region Constructors
		public FundDonation()
		{
		}

		public FundDonation(DataRow row)
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
			if (row.Table.Columns.Contains("DonationId"))
			{
				if (Convert.IsDBNull(row["DonationId"])) IsDonationIdNull = true;
				else DonationId = Convert.ToInt32(row["DonationId"]);
			}
			if (row.Table.Columns.Contains("FundId"))
			{
				if (Convert.IsDBNull(row["FundId"])) IsFundIdNull = true;
				else FundId = Convert.ToInt32(row["FundId"]);
			}
			if (row.Table.Columns.Contains("Amount"))
			{
				if (Convert.IsDBNull(row["Amount"])) IsAmountNull = true;
				else Amount = Convert.ToDouble(row["Amount"]);
			}
		}
		#endregion

		#region Methods
		public static FundDonation Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			FundDonations fundDonations = FundDonations.Load(sql, commandType, parameters);
			return (fundDonations.Count == 0) ? null : fundDonations[0];
		}

		public static FundDonation Load(int id, int churchId)
		{
			return Load("SELECT * FROM FundDonations WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO FundDonations (ChurchId, DonationId, FundId, Amount) VALUES (@ChurchId, @DonationId, @FundId, @Amount); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@DonationId", (_isDonationIdNull) ? System.DBNull.Value : (object)_donationId);
			cmd.Parameters.AddWithValue("@FundId", (_isFundIdNull) ? System.DBNull.Value : (object)_fundId);
			cmd.Parameters.AddWithValue("@Amount", (_isAmountNull) ? System.DBNull.Value : (object)_amount);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE FundDonations SET ChurchId=@ChurchId, DonationId=@DonationId, FundId=@FundId, Amount=@Amount WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@DonationId", (_isDonationIdNull) ? System.DBNull.Value : (object)_donationId);
			cmd.Parameters.AddWithValue("@FundId", (_isFundIdNull) ? System.DBNull.Value : (object)_fundId);
			cmd.Parameters.AddWithValue("@Amount", (_isAmountNull) ? System.DBNull.Value : (object)_amount);
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
			DbHelper.ExecuteNonQuery("DELETE FROM FundDonations WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(FundDonation).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
