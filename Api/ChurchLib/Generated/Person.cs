 

using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Reflection;
using System.Xml.Serialization;

namespace ChurchLib{
	[Serializable]
	public partial class Person
	{
		#region Declarations
		System.Int32 _id;
		System.Int32 _churchId;
		System.Int32 _campusId;
		System.String _firstName;
		System.String _middleName;
		System.String _lastName;
		System.String _nickName;
		System.String _prefix;
		System.String _suffix;
		System.DateTime _birthDate;
		System.String _gender;
		System.String _maritalStatus;
		System.DateTime _anniversary;
		System.String _membershipStatus;
		System.String _homePhone;
		System.String _mobilePhone;
		System.String _workPhone;
		System.String _email;
		System.String _address1;
		System.String _address2;
		System.String _city;
		System.String _state;
		System.String _zip;
		System.DateTime _photoUpdated;
		System.Boolean _removed;

		bool _isIdNull = true;
		bool _isChurchIdNull = true;
		bool _isCampusIdNull = true;
		bool _isFirstNameNull = true;
		bool _isMiddleNameNull = true;
		bool _isLastNameNull = true;
		bool _isNickNameNull = true;
		bool _isPrefixNull = true;
		bool _isSuffixNull = true;
		bool _isBirthDateNull = true;
		bool _isGenderNull = true;
		bool _isMaritalStatusNull = true;
		bool _isAnniversaryNull = true;
		bool _isMembershipStatusNull = true;
		bool _isHomePhoneNull = true;
		bool _isMobilePhoneNull = true;
		bool _isWorkPhoneNull = true;
		bool _isEmailNull = true;
		bool _isAddress1Null = true;
		bool _isAddress2Null = true;
		bool _isCityNull = true;
		bool _isStateNull = true;
		bool _isZipNull = true;
		bool _isPhotoUpdatedNull = true;
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
		public System.Int32 CampusId
		{
			get{ return _campusId; }
			set{ _campusId=value; _isCampusIdNull=false; }
		}
		public System.String FirstName
		{
			get{ return _firstName; }
			set{ _firstName=value; _isFirstNameNull=false; }
		}
		public System.String MiddleName
		{
			get{ return _middleName; }
			set{ _middleName=value; _isMiddleNameNull=false; }
		}
		public System.String LastName
		{
			get{ return _lastName; }
			set{ _lastName=value; _isLastNameNull=false; }
		}
		public System.String NickName
		{
			get{ return _nickName; }
			set{ _nickName=value; _isNickNameNull=false; }
		}
		public System.String Prefix
		{
			get{ return _prefix; }
			set{ _prefix=value; _isPrefixNull=false; }
		}
		public System.String Suffix
		{
			get{ return _suffix; }
			set{ _suffix=value; _isSuffixNull=false; }
		}
		public System.DateTime BirthDate
		{
			get{ return _birthDate; }
			set{ _birthDate=value; _isBirthDateNull=false; }
		}
		public System.String Gender
		{
			get{ return _gender; }
			set{ _gender=value; _isGenderNull=false; }
		}
		public System.String MaritalStatus
		{
			get{ return _maritalStatus; }
			set{ _maritalStatus=value; _isMaritalStatusNull=false; }
		}
		public System.DateTime Anniversary
		{
			get{ return _anniversary; }
			set{ _anniversary=value; _isAnniversaryNull=false; }
		}
		public System.String MembershipStatus
		{
			get{ return _membershipStatus; }
			set{ _membershipStatus=value; _isMembershipStatusNull=false; }
		}
		public System.String HomePhone
		{
			get{ return _homePhone; }
			set{ _homePhone=value; _isHomePhoneNull=false; }
		}
		public System.String MobilePhone
		{
			get{ return _mobilePhone; }
			set{ _mobilePhone=value; _isMobilePhoneNull=false; }
		}
		public System.String WorkPhone
		{
			get{ return _workPhone; }
			set{ _workPhone=value; _isWorkPhoneNull=false; }
		}
		public System.String Email
		{
			get{ return _email; }
			set{ _email=value; _isEmailNull=false; }
		}
		public System.String Address1
		{
			get{ return _address1; }
			set{ _address1=value; _isAddress1Null=false; }
		}
		public System.String Address2
		{
			get{ return _address2; }
			set{ _address2=value; _isAddress2Null=false; }
		}
		public System.String City
		{
			get{ return _city; }
			set{ _city=value; _isCityNull=false; }
		}
		public System.String State
		{
			get{ return _state; }
			set{ _state=value; _isStateNull=false; }
		}
		public System.String Zip
		{
			get{ return _zip; }
			set{ _zip=value; _isZipNull=false; }
		}
		public System.DateTime PhotoUpdated
		{
			get{ return _photoUpdated; }
			set{ _photoUpdated=value; _isPhotoUpdatedNull=false; }
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
		public bool IsCampusIdNull
		{
			get { return _isCampusIdNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCampusIdNull = true;
				_campusId = 0;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsFirstNameNull
		{
			get { return _isFirstNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isFirstNameNull = true;
				_firstName = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMiddleNameNull
		{
			get { return _isMiddleNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMiddleNameNull = true;
				_middleName = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsLastNameNull
		{
			get { return _isLastNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isLastNameNull = true;
				_lastName = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsNickNameNull
		{
			get { return _isNickNameNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isNickNameNull = true;
				_nickName = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsPrefixNull
		{
			get { return _isPrefixNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPrefixNull = true;
				_prefix = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsSuffixNull
		{
			get { return _isSuffixNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isSuffixNull = true;
				_suffix = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsBirthDateNull
		{
			get { return _isBirthDateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isBirthDateNull = true;
				_birthDate = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsGenderNull
		{
			get { return _isGenderNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isGenderNull = true;
				_gender = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMaritalStatusNull
		{
			get { return _isMaritalStatusNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMaritalStatusNull = true;
				_maritalStatus = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAnniversaryNull
		{
			get { return _isAnniversaryNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAnniversaryNull = true;
				_anniversary = DateTime.MinValue;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMembershipStatusNull
		{
			get { return _isMembershipStatusNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMembershipStatusNull = true;
				_membershipStatus = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsHomePhoneNull
		{
			get { return _isHomePhoneNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isHomePhoneNull = true;
				_homePhone = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsMobilePhoneNull
		{
			get { return _isMobilePhoneNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isMobilePhoneNull = true;
				_mobilePhone = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsWorkPhoneNull
		{
			get { return _isWorkPhoneNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isWorkPhoneNull = true;
				_workPhone = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsEmailNull
		{
			get { return _isEmailNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isEmailNull = true;
				_email = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAddress1Null
		{
			get { return _isAddress1Null; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAddress1Null = true;
				_address1 = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsAddress2Null
		{
			get { return _isAddress2Null; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isAddress2Null = true;
				_address2 = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsCityNull
		{
			get { return _isCityNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isCityNull = true;
				_city = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsStateNull
		{
			get { return _isStateNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isStateNull = true;
				_state = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsZipNull
		{
			get { return _isZipNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isZipNull = true;
				_zip = System.String.Empty;
			}
		}
		[XmlIgnoreAttribute]
		public bool IsPhotoUpdatedNull
		{
			get { return _isPhotoUpdatedNull; }
			set
			{
				if (!value) throw new Exception("Can not set this property to false");
				_isPhotoUpdatedNull = true;
				_photoUpdated = DateTime.MinValue;
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
		public Person()
		{
		}

		public Person(DataRow row)
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
			if (row.Table.Columns.Contains("CampusId"))
			{
				if (Convert.IsDBNull(row["CampusId"])) IsCampusIdNull = true;
				else CampusId = Convert.ToInt32(row["CampusId"]);
			}
			if (row.Table.Columns.Contains("FirstName"))
			{
				if (Convert.IsDBNull(row["FirstName"])) IsFirstNameNull = true;
				else FirstName = Convert.ToString(row["FirstName"]);
			}
			if (row.Table.Columns.Contains("MiddleName"))
			{
				if (Convert.IsDBNull(row["MiddleName"])) IsMiddleNameNull = true;
				else MiddleName = Convert.ToString(row["MiddleName"]);
			}
			if (row.Table.Columns.Contains("LastName"))
			{
				if (Convert.IsDBNull(row["LastName"])) IsLastNameNull = true;
				else LastName = Convert.ToString(row["LastName"]);
			}
			if (row.Table.Columns.Contains("NickName"))
			{
				if (Convert.IsDBNull(row["NickName"])) IsNickNameNull = true;
				else NickName = Convert.ToString(row["NickName"]);
			}
			if (row.Table.Columns.Contains("Prefix"))
			{
				if (Convert.IsDBNull(row["Prefix"])) IsPrefixNull = true;
				else Prefix = Convert.ToString(row["Prefix"]);
			}
			if (row.Table.Columns.Contains("Suffix"))
			{
				if (Convert.IsDBNull(row["Suffix"])) IsSuffixNull = true;
				else Suffix = Convert.ToString(row["Suffix"]);
			}
			if (row.Table.Columns.Contains("BirthDate"))
			{
				if (Convert.IsDBNull(row["BirthDate"])) IsBirthDateNull = true;
				else BirthDate = Convert.ToDateTime(row["BirthDate"]);
			}
			if (row.Table.Columns.Contains("Gender"))
			{
				if (Convert.IsDBNull(row["Gender"])) IsGenderNull = true;
				else Gender = Convert.ToString(row["Gender"]);
			}
			if (row.Table.Columns.Contains("MaritalStatus"))
			{
				if (Convert.IsDBNull(row["MaritalStatus"])) IsMaritalStatusNull = true;
				else MaritalStatus = Convert.ToString(row["MaritalStatus"]);
			}
			if (row.Table.Columns.Contains("Anniversary"))
			{
				if (Convert.IsDBNull(row["Anniversary"])) IsAnniversaryNull = true;
				else Anniversary = Convert.ToDateTime(row["Anniversary"]);
			}
			if (row.Table.Columns.Contains("MembershipStatus"))
			{
				if (Convert.IsDBNull(row["MembershipStatus"])) IsMembershipStatusNull = true;
				else MembershipStatus = Convert.ToString(row["MembershipStatus"]);
			}
			if (row.Table.Columns.Contains("HomePhone"))
			{
				if (Convert.IsDBNull(row["HomePhone"])) IsHomePhoneNull = true;
				else HomePhone = Convert.ToString(row["HomePhone"]);
			}
			if (row.Table.Columns.Contains("MobilePhone"))
			{
				if (Convert.IsDBNull(row["MobilePhone"])) IsMobilePhoneNull = true;
				else MobilePhone = Convert.ToString(row["MobilePhone"]);
			}
			if (row.Table.Columns.Contains("WorkPhone"))
			{
				if (Convert.IsDBNull(row["WorkPhone"])) IsWorkPhoneNull = true;
				else WorkPhone = Convert.ToString(row["WorkPhone"]);
			}
			if (row.Table.Columns.Contains("Email"))
			{
				if (Convert.IsDBNull(row["Email"])) IsEmailNull = true;
				else Email = Convert.ToString(row["Email"]);
			}
			if (row.Table.Columns.Contains("Address1"))
			{
				if (Convert.IsDBNull(row["Address1"])) IsAddress1Null = true;
				else Address1 = Convert.ToString(row["Address1"]);
			}
			if (row.Table.Columns.Contains("Address2"))
			{
				if (Convert.IsDBNull(row["Address2"])) IsAddress2Null = true;
				else Address2 = Convert.ToString(row["Address2"]);
			}
			if (row.Table.Columns.Contains("City"))
			{
				if (Convert.IsDBNull(row["City"])) IsCityNull = true;
				else City = Convert.ToString(row["City"]);
			}
			if (row.Table.Columns.Contains("State"))
			{
				if (Convert.IsDBNull(row["State"])) IsStateNull = true;
				else State = Convert.ToString(row["State"]);
			}
			if (row.Table.Columns.Contains("Zip"))
			{
				if (Convert.IsDBNull(row["Zip"])) IsZipNull = true;
				else Zip = Convert.ToString(row["Zip"]);
			}
			if (row.Table.Columns.Contains("PhotoUpdated"))
			{
				if (Convert.IsDBNull(row["PhotoUpdated"])) IsPhotoUpdatedNull = true;
				else PhotoUpdated = Convert.ToDateTime(row["PhotoUpdated"]);
			}
			if (row.Table.Columns.Contains("Removed"))
			{
				if (Convert.IsDBNull(row["Removed"])) IsRemovedNull = true;
				else Removed = Convert.ToBoolean(row["Removed"]);
			}
		}
		#endregion

		#region Methods
		public static Person Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			People people = People.Load(sql, commandType, parameters);
			return (people.Count == 0) ? null : people[0];
		}

		public static Person Load(int id, int churchId)
		{
			return Load("SELECT * FROM People WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId) });
		}

		internal MySqlCommand GetSaveCommand(MySqlConnection conn)
		{
			return (_id==0) ? GetInsertCommand(conn) : GetUpdateCommand(conn);
		}

		internal MySqlCommand GetInsertCommand(MySqlConnection conn)
		{
			string sql = "INSERT INTO People (ChurchId, CampusId, FirstName, MiddleName, LastName, NickName, Prefix, Suffix, BirthDate, Gender, MaritalStatus, Anniversary, MembershipStatus, HomePhone, MobilePhone, WorkPhone, Email, Address1, Address2, City, State, Zip, PhotoUpdated, Removed) VALUES (@ChurchId, @CampusId, @FirstName, @MiddleName, @LastName, @NickName, @Prefix, @Suffix, @BirthDate, @Gender, @MaritalStatus, @Anniversary, @MembershipStatus, @HomePhone, @MobilePhone, @WorkPhone, @Email, @Address1, @Address2, @City, @State, @Zip, @PhotoUpdated, @Removed); SELECT LAST_INSERT_ID();";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@CampusId", (_isCampusIdNull) ? System.DBNull.Value : (object)_campusId);
			cmd.Parameters.AddWithValue("@FirstName", (_isFirstNameNull) ? System.DBNull.Value : (object)_firstName);
			cmd.Parameters.AddWithValue("@MiddleName", (_isMiddleNameNull) ? System.DBNull.Value : (object)_middleName);
			cmd.Parameters.AddWithValue("@LastName", (_isLastNameNull) ? System.DBNull.Value : (object)_lastName);
			cmd.Parameters.AddWithValue("@NickName", (_isNickNameNull) ? System.DBNull.Value : (object)_nickName);
			cmd.Parameters.AddWithValue("@Prefix", (_isPrefixNull) ? System.DBNull.Value : (object)_prefix);
			cmd.Parameters.AddWithValue("@Suffix", (_isSuffixNull) ? System.DBNull.Value : (object)_suffix);
			cmd.Parameters.AddWithValue("@BirthDate", (_isBirthDateNull) ? System.DBNull.Value : (object)_birthDate);
			cmd.Parameters.AddWithValue("@Gender", (_isGenderNull) ? System.DBNull.Value : (object)_gender);
			cmd.Parameters.AddWithValue("@MaritalStatus", (_isMaritalStatusNull) ? System.DBNull.Value : (object)_maritalStatus);
			cmd.Parameters.AddWithValue("@Anniversary", (_isAnniversaryNull) ? System.DBNull.Value : (object)_anniversary);
			cmd.Parameters.AddWithValue("@MembershipStatus", (_isMembershipStatusNull) ? System.DBNull.Value : (object)_membershipStatus);
			cmd.Parameters.AddWithValue("@HomePhone", (_isHomePhoneNull) ? System.DBNull.Value : (object)_homePhone);
			cmd.Parameters.AddWithValue("@MobilePhone", (_isMobilePhoneNull) ? System.DBNull.Value : (object)_mobilePhone);
			cmd.Parameters.AddWithValue("@WorkPhone", (_isWorkPhoneNull) ? System.DBNull.Value : (object)_workPhone);
			cmd.Parameters.AddWithValue("@Email", (_isEmailNull) ? System.DBNull.Value : (object)_email);
			cmd.Parameters.AddWithValue("@Address1", (_isAddress1Null) ? System.DBNull.Value : (object)_address1);
			cmd.Parameters.AddWithValue("@Address2", (_isAddress2Null) ? System.DBNull.Value : (object)_address2);
			cmd.Parameters.AddWithValue("@City", (_isCityNull) ? System.DBNull.Value : (object)_city);
			cmd.Parameters.AddWithValue("@State", (_isStateNull) ? System.DBNull.Value : (object)_state);
			cmd.Parameters.AddWithValue("@Zip", (_isZipNull) ? System.DBNull.Value : (object)_zip);
			cmd.Parameters.AddWithValue("@PhotoUpdated", (_isPhotoUpdatedNull) ? System.DBNull.Value : (object)_photoUpdated);
			cmd.Parameters.AddWithValue("@Removed", (_isRemovedNull) ? System.DBNull.Value : (object)_removed);
			return cmd;
		}

		internal MySqlCommand GetUpdateCommand(MySqlConnection conn)
		{
			string sql = "UPDATE People SET ChurchId=@ChurchId, CampusId=@CampusId, FirstName=@FirstName, MiddleName=@MiddleName, LastName=@LastName, NickName=@NickName, Prefix=@Prefix, Suffix=@Suffix, BirthDate=@BirthDate, Gender=@Gender, MaritalStatus=@MaritalStatus, Anniversary=@Anniversary, MembershipStatus=@MembershipStatus, HomePhone=@HomePhone, MobilePhone=@MobilePhone, WorkPhone=@WorkPhone, Email=@Email, Address1=@Address1, Address2=@Address2, City=@City, State=@State, Zip=@Zip, PhotoUpdated=@PhotoUpdated, Removed=@Removed WHERE Id=@Id AND ChurchId=@ChurchId; SELECT @Id;";
			MySqlCommand cmd = new MySqlCommand(sql, conn) {CommandType = CommandType.Text};
			cmd.Parameters.AddWithValue("@Id", (_isIdNull) ? System.DBNull.Value : (object)_id);
			cmd.Parameters.AddWithValue("@ChurchId", (_isChurchIdNull) ? System.DBNull.Value : (object)_churchId);
			cmd.Parameters.AddWithValue("@CampusId", (_isCampusIdNull) ? System.DBNull.Value : (object)_campusId);
			cmd.Parameters.AddWithValue("@FirstName", (_isFirstNameNull) ? System.DBNull.Value : (object)_firstName);
			cmd.Parameters.AddWithValue("@MiddleName", (_isMiddleNameNull) ? System.DBNull.Value : (object)_middleName);
			cmd.Parameters.AddWithValue("@LastName", (_isLastNameNull) ? System.DBNull.Value : (object)_lastName);
			cmd.Parameters.AddWithValue("@NickName", (_isNickNameNull) ? System.DBNull.Value : (object)_nickName);
			cmd.Parameters.AddWithValue("@Prefix", (_isPrefixNull) ? System.DBNull.Value : (object)_prefix);
			cmd.Parameters.AddWithValue("@Suffix", (_isSuffixNull) ? System.DBNull.Value : (object)_suffix);
			cmd.Parameters.AddWithValue("@BirthDate", (_isBirthDateNull) ? System.DBNull.Value : (object)_birthDate);
			cmd.Parameters.AddWithValue("@Gender", (_isGenderNull) ? System.DBNull.Value : (object)_gender);
			cmd.Parameters.AddWithValue("@MaritalStatus", (_isMaritalStatusNull) ? System.DBNull.Value : (object)_maritalStatus);
			cmd.Parameters.AddWithValue("@Anniversary", (_isAnniversaryNull) ? System.DBNull.Value : (object)_anniversary);
			cmd.Parameters.AddWithValue("@MembershipStatus", (_isMembershipStatusNull) ? System.DBNull.Value : (object)_membershipStatus);
			cmd.Parameters.AddWithValue("@HomePhone", (_isHomePhoneNull) ? System.DBNull.Value : (object)_homePhone);
			cmd.Parameters.AddWithValue("@MobilePhone", (_isMobilePhoneNull) ? System.DBNull.Value : (object)_mobilePhone);
			cmd.Parameters.AddWithValue("@WorkPhone", (_isWorkPhoneNull) ? System.DBNull.Value : (object)_workPhone);
			cmd.Parameters.AddWithValue("@Email", (_isEmailNull) ? System.DBNull.Value : (object)_email);
			cmd.Parameters.AddWithValue("@Address1", (_isAddress1Null) ? System.DBNull.Value : (object)_address1);
			cmd.Parameters.AddWithValue("@Address2", (_isAddress2Null) ? System.DBNull.Value : (object)_address2);
			cmd.Parameters.AddWithValue("@City", (_isCityNull) ? System.DBNull.Value : (object)_city);
			cmd.Parameters.AddWithValue("@State", (_isStateNull) ? System.DBNull.Value : (object)_state);
			cmd.Parameters.AddWithValue("@Zip", (_isZipNull) ? System.DBNull.Value : (object)_zip);
			cmd.Parameters.AddWithValue("@PhotoUpdated", (_isPhotoUpdatedNull) ? System.DBNull.Value : (object)_photoUpdated);
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
			DbHelper.ExecuteNonQuery("DELETE FROM People WHERE Id=@Id AND ChurchId=@ChurchId", CommandType.Text, new MySqlParameter[] { new MySqlParameter("@Id", id), new MySqlParameter("@ChurchId", churchId)  });
		}

		public object GetPropertyValue(string propertyName)
		{
			return typeof(Person).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(this, null);
		}
		#endregion
	}
}
