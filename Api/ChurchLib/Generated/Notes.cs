 
using System;
using System.Data;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Collections.Generic;

namespace ChurchLib{
	[Serializable]
	public partial class Notes : List<Note>
	{

		#region Constructors
		public Notes() { }
		
		public Notes(DataTable dt)
		{
			foreach (DataRow row in dt.Rows) Add(new Note(row));
		}
		#endregion

		#region Methods
		public static Notes Load(string sql, CommandType commandType = CommandType.Text, MySqlParameter[] parameters = null)
		{
			return new Notes(DbHelper.ExecuteQuery(sql, commandType, parameters));
		}

		public static Notes Load(int[] ids, int churchId)
		{
			if (ids.Length==0) return new Notes();
			else return Load("SELECT * FROM Notes WHERE ID IN (" + String.Join(",", ids) + ") AND ChurchId=" + churchId.ToString());
		}

		public static Notes LoadAll()
		{
			return Load("SELECT * FROM Notes", CommandType.Text, null);
		}

		public async System.Threading.Tasks.Task SaveAsync(int threadCount)
		{
			System.Threading.Semaphore sem = new System.Threading.Semaphore(threadCount, threadCount);
			List<System.Threading.Tasks.Task> tasks = new List<System.Threading.Tasks.Task>();
			foreach (Note note in this)
			{
				System.Threading.Tasks.Task t = System.Threading.Tasks.Task.Factory.StartNew(() =>
				{
					sem.WaitOne();
					try { note.Save(); }
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
				foreach (Note note in this)
				{
					MySqlCommand cmd = note.GetSaveCommand(conn);
					note.Id = Convert.ToInt32(cmd.ExecuteScalar());
				}
			}
			finally { conn.Close(); }
		}

		public DataTable ConvertToDataTable()
		{
			DataTable dt = DbHelper.FillDt("SELECT * FROM Notes WHERE ID=0");
            foreach (Note note in this)
            {
                DataRow row = dt.NewRow();
				if (!note.IsChurchIdNull) row["ChurchId"] = note.ChurchId;
				if (!note.IsContentTypeNull) row["ContentType"] = note.ContentType;
				if (!note.IsContentIdNull) row["ContentId"] = note.ContentId;
				if (!note.IsNoteTypeNull) row["NoteType"] = note.NoteType;
				if (!note.IsAddedByNull) row["AddedBy"] = note.AddedBy;
				if (!note.IsDateAddedNull) row["DateAdded"] = note.DateAdded;
				if (!note.IsContentsNull) row["Contents"] = note.Contents;
                dt.Rows.Add(row);
            }
            return dt;
		}

		public int[] GetIds()
		{
			List<int> result = new List<int>();
			foreach (Note note in this) result.Add(note.Id);
			return result.ToArray();
		}

		public Note GetById(int id)
		{
			foreach (Note note in this) if (note.Id == id) return note;
			return null;
		}

		public Notes GetAllByIds(int[] ids)
		{
			List<int> idList = new List<int>(ids);
			Notes result = new Notes();
			foreach (Note note in this) if (idList.Contains(note.Id)) result.Add(note);
			return result;
		}

		public Notes Sort(string column, bool desc)
		{
			var sortedList = desc ? this.OrderByDescending(x => x.GetPropertyValue(column)) : this.OrderBy(x => x.GetPropertyValue(column));
			Notes result = new Notes();
			foreach (var i in sortedList) { result.Add((Note)i); }
			return result;
		}

		#endregion
	}
}
