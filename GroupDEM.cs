using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillSplit
{
    public class GroupDEM
    {
        public int GroupID { get; set; }
        public string GroupName { get; set; }
        public List<GroupMapDEM> GroupMapDEMCollection { get; set; }
    }

    public class GroupMapDEM
    {
        public int GroupMapID { get; set; }
        public int GroupID { get; set; }
        public int MemberID { get; set; }
        public string MemberName { get; set; }
    }
}
