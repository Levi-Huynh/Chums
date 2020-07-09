 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class People : List<Person>
	{

		#region Constructors
		public People() { }
		
		public People(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Person(row));
		}
		#endregion

		#region Methods
		public static People Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new People(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static People Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new People();
			else return Load("SELECT * FROM People WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static People LoadAll()
		{
			return Load("SELECT * FROM People", CommandType.Text, null);
		}

		public static People LoadByCampusId(System.Int32 campusId, int churchId)
		{
			string sql="SELECT * FROM People WHERE ChurchId=@ChurchId AND CampusId=@CampusId;";
			return Load(sql, CommandType.Text, new MySqlParameter[] { new MySqlParameter("@CampusId", campusId), new MySqlParameter("@ChurchId", churchId) });
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Person person in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { person.Save(); }
					finally { sem.Release(); }
				});
				tasks.Add(t);
			}
			await System.Threading.Tasks.Task.WhenAll(tasks.ToArray());
		}

		public void SaveAll(bool waitForId = true)
		{
			MySqlConnection conn = DbHelper.Connection;
			try
			{
				conn.Open();
				DbHelper.SetContextInfo(conn);
				foreach (Person person in this)
				{
					MySqlCommand cmd = person.GetSaveCommand(conn);
					person.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM People WHERE ID=0");
            foreach (Person person in this)
            {
                DataRow row = dt.NewRow();
				if (!person.IsChurchIdNull) row["ChurchId"] = person.ChurchId;
				if (!person.IsCampusIdNull) row["CampusId"] = person.CampusId;
				if (!person.IsFirstNameNull) row["FirstName"] = person.FirstName;
				if (!person.IsMiddleNameNull) row["MiddleName"] = person.MiddleName;
				if (!person.IsLastNameNull) row["LastName"] = person.LastName;
				if (!person.IsNickNameNull) row["NickName"] = person.NickName;
				if (!person.IsPrefixNull) row["Prefix"] = person.Prefix;
				if (!person.IsSuffixNull) row["Suffix"] = person.Suffix;
				if (!person.IsBirthDateNull) row["BirthDate"] = person.BirthDate;
				if (!person.IsGenderNull) row["Gender"] = person.Gender;
				if (!person.IsMaritalStatusNull) row["MaritalStatus"] = person.MaritalStatus;
				if (!person.IsAnniversaryNull) row["Anniversary"] = person.Anniversary;
				if (!person.IsMembershipStatusNull) row["MembershipStatus"] = person.MembershipStatus;
				if (!person.IsHomePhoneNull) row["HomePhone"] = person.HomePhone;
				if (!person.IsMobilePhoneNull) row["MobilePhone"] = person.MobilePhone;
				if (!person.IsWorkPhoneNull) row["WorkPhone"] = person.WorkPhone;
				if (!person.IsEmailNull) row["Email"] = person.Email;
				if (!person.IsAddress1Null) row["Address1"] = person.Address1;
				if (!person.IsAddress2Null) row["Address2"] = person.Address2;
				if (!person.IsCityNull) row["City"] = person.City;
				if (!person.IsStateNull) row["State"] = person.State;
				if (!person.IsZipNull) row["Zip"] = person.Zip;
				if (!person.IsPhotoUpdatedNull) row["PhotoUpdated"] = person.PhotoUpdated;
				if (!person.IsRemovedNull) row["Removed"] = person.Removed;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Person person in this) result.Add(person.Id);
			return result.ToArray();
		}

		public Person GetById(int id)
		{
			foreach (Person person in this) if (person.Id == id) return person;
			return null;
		}

		public People GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			People result = new People();
			foreach (Person person in this) if (idList.Contains(person.Id)) result.Add(person);
			return result;
		}

		public People GetAllByCampusId(System.Int32 campusId)
		{
			People result = new People();
			foreach (Person person in this) if (person.CampusId == campusId) result.Add(person);
			return result;
		}

		public People Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			People result = new People();
			foreach (var i in sortedList) { result.Add((Person)i); }
			return result;
		}

		#endregion
	}
}
