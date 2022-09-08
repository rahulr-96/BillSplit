using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillSplit
{
    public class AcPayRecMasterDEM
    {

        public int AcPayRecMasterID { get; set; }
        public int GroupID { get; set; }
        public int TotalAmount { get; set; }
        public string GroupName { get; set; }
        public string BillName { get; set; }
        public int PaidBy { get; set; }
        public string PaidByName { get; set; }

        public List<AcPayRecDetailsDEM> AcPayRecDetailsDEMCollection { get; set; }


    }

    public class AcPayRecDetailsDEM
    {
        public int AcPayRecDetailID { get; set; }
        public int AcPayRecMasterID { get; set; }
        public int Amount { get; set; }
        public int MemberID { get; set; }
        public string MemberName { get; set; }
    }

    public class DebitOutstandingDEM
    {
        public string BillName { get; set; }
        public int GroupID { get; set; }
        public string GroupName { get; set; }

        public int Amount { get; set; }

        public int MemberID { get; set; }

        public string MemberName { get; set; }
    }
}
