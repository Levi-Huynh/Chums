using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib
{
    public partial class Questions
    {
        public void Renumber()
        {
            for (int i=0;i<this.Count;i++) this[i].Sort = (i*2);
        }

        public Questions GetByParentId(int parentId)
        {
            Questions result = new Questions();
            foreach (Question q in this) if (q.ParentId == parentId) result.Add(q);
            return result;
        }

        public Questions GetActive()
        {
            Questions result = new Questions();
            foreach (Question q in this) if (!q.Removed) result.Add(q);
            return result;
        }

    }
}
