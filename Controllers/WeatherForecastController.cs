using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using System.Net.Http;

namespace BillSplit.Controllers
{
    [ApiController]
    [Route("BillSplit")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {

            using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText =
                                @"
                        INSERT INTO GroupTbl (GroupName, purge) VALUES (""John"", 0); 
                    ";
                //command.Parameters.AddWithValue("$id", id);

                command.ExecuteScalar();

                connection.Close();
            }

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();

        }

        [HttpPost]
        [Route("SaveGroup")]
        public string  SaveGroup([FromBody] GroupDEM objGroupDEM)
        {
            try
            {

                if (objGroupDEM.GroupName == null)
                {
                    return "Failed";
                }

                using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
                {
                    connection.Open();

                   // var sqlStr = "INSERT INTO GroupTbl (GroupName, purge) VALUES (" + ""+ GroupName + "" + "," + Purge + ") RETURNING GroupID;";


                    var insertSQL = new SqliteCommand("INSERT INTO GroupTbl (GroupName, purge)" +
                        " VALUES (@GroupName, @Purge) RETURNING GroupID", connection);
                    insertSQL.Parameters.AddWithValue("@GroupName", objGroupDEM.GroupName);
                    insertSQL.Parameters.AddWithValue("@Purge", objGroupDEM.Purge);


                    var re = insertSQL.ExecuteScalar();


                    foreach (var item in objGroupDEM.GroupMapDEMCollection)
                    {
                        var insertMapSQL = new SqliteCommand("INSERT INTO GroupMapTbl (GroupID, MemberID)" +
                        " VALUES (@GroupID, @MemberID) ", connection);

                        item.GroupID = Convert.ToInt32(re);

                        insertMapSQL.Parameters.AddWithValue("@GroupID", item.GroupID);
                        insertMapSQL.Parameters.AddWithValue("@MemberID", item.MemberID);

                        insertMapSQL.ExecuteScalar();
                    }

                    connection.Close();
                }


                return "Success ";
            }

            catch (Exception ex)
            {
                return "Error " + ex.ToString();  
            }
        }

        [HttpGet]
        [Route("SelectGroupWithMemberID")]
        public IEnumerable<GroupDEM> SelectGroupWithMemberID([FromBody] MemberDEM objMemberDEM)
        {
            try
            {
                List<GroupDEM> lstGroupDEM = new List<GroupDEM>();
                using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
                {
                    connection.Open();

                    // var sqlStr = "INSERT INTO GroupTbl (GroupName, purge) VALUES (" + ""+ GroupName + "" + "," + Purge + ") RETURNING GroupID;";


                    var selectGroupSQL = new SqliteCommand("select a.GroupID, a.GroupName from GroupTbl a, GroupMapTbl b " +
                        "where a.GroupID = b.GroupID and b.MemberId  = @MemberID", connection);
                    selectGroupSQL.Parameters.AddWithValue("@MemberID", objMemberDEM.MemberID);


                    var reader = selectGroupSQL.ExecuteReader();

                    

                    GroupDEM objGroupDEM = null;
                    GroupMapDEM objGroupMapDEM = null;

                    while (reader.Read())
                    {
                        objGroupDEM = new GroupDEM();
                        objGroupDEM.GroupID = Convert.ToInt32(reader["GroupID"]);
                        objGroupDEM.GroupName = Convert.ToString(reader["GroupName"]);
                        lstGroupDEM.Add(objGroupDEM);
                    }

                    foreach (var item in lstGroupDEM)
                    {
                        var selectGroupMapSQL = new SqliteCommand("select  b.GroupMapID, a.GroupID,  a.GroupName, c.MemberID, c.MemberName from GroupTbl a, GroupMapTbl b, MemberTbl c " +
                            "where a.GroupID = b.GroupID and b.MemberId = c.MemberID and a.GroupID = @GroupID", connection);
                        selectGroupMapSQL.Parameters.AddWithValue("@GroupID", item.GroupID);

                        var GroupMapreader = selectGroupMapSQL.ExecuteReader();

                        item.GroupMapDEMCollection = new List<GroupMapDEM>();

                        while (GroupMapreader.Read())
                        {
                            objGroupMapDEM = new GroupMapDEM();
                            objGroupMapDEM.GroupMapID = Convert.ToInt32(GroupMapreader["GroupMapID"]);
                            objGroupMapDEM.GroupID = Convert.ToInt32(GroupMapreader["GroupID"]);
                            objGroupMapDEM.MemberID = Convert.ToInt32(GroupMapreader["MemberID"]);
                            objGroupMapDEM.MemberName = Convert.ToString(GroupMapreader["MemberName"]);

                            item.GroupMapDEMCollection.Add(objGroupMapDEM);
                        }

                    }

                    connection.Close();
                }


                return lstGroupDEM;
            }

            catch (Exception ex)
            {
                throw; 
            }
        }

        [HttpGet]
        [Route("SelectAcPayRecMasterWithPaidBy")]
        public IEnumerable<AcPayRecMasterDEM> SelectAcPayRecMasterWithID([FromBody] AcPayRecMasterDEM objAcPayRecMasterDEM)
        {
            try
            {
                List<AcPayRecMasterDEM> lstAcPayRecMasterDEM = new List<AcPayRecMasterDEM>();
                using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
                {
                    connection.Open();

                    // var sqlStr = "INSERT INTO GroupTbl (GroupName, purge) VALUES (" + ""+ GroupName + "" + "," + Purge + ") RETURNING GroupID;";


                    var selectAcPayRecMasterSQL = new SqliteCommand("select a.AcPayRecMasterID, a.BillName, b.GroupID,  b.GroupName, a.TotalAmount " +
                        "from AcPayRecMaster a, GroupTbl b " +
                        "where  a.GroupID = b.GroupID and a.PaidBy = @PaidBy", connection);
                    selectAcPayRecMasterSQL.Parameters.AddWithValue("@PaidBy", objAcPayRecMasterDEM.PaidBy);


                    var reader = selectAcPayRecMasterSQL.ExecuteReader();



                    AcPayRecMasterDEM objTempAcPayRecMasterDEM = null;
                    AcPayRecDetailsDEM objAcPayRecDetailsDEM = null;

                    while (reader.Read())
                    {
                        objTempAcPayRecMasterDEM = new AcPayRecMasterDEM();

                        objTempAcPayRecMasterDEM.AcPayRecMasterID = Convert.ToInt32(reader["AcPayRecMasterID"]);
                        objTempAcPayRecMasterDEM.GroupID = Convert.ToInt32(reader["GroupID"]);
                        objTempAcPayRecMasterDEM.GroupName = Convert.ToString(reader["GroupName"]);
                        objTempAcPayRecMasterDEM.BillName = Convert.ToString(reader["BillName"]);
                        objTempAcPayRecMasterDEM.TotalAmount = Convert.ToInt32(reader["TotalAmount"]);
                        lstAcPayRecMasterDEM.Add(objTempAcPayRecMasterDEM);
                    }

                    foreach (var item in lstAcPayRecMasterDEM)
                    {
                        var selectAcPayRecDetailsSQL = new SqliteCommand("select a.AcPayRecMasterID, b.AcPayRecDetailID, b.Amount, d.MemberID, d.MemberName " +
                            "from AcPayRecDetails b, AcPayRecMaster a, GroupTbl c, MemberTbl d " +
                            "where a.AcPayRecMasterID = b.AcPayRecMasterID and a.GroupID = c.GroupID and b.MemberID = d.MemberID and a.AcPayRecMasterID = @AcPayRecMasterID", connection);
                        selectAcPayRecDetailsSQL.Parameters.AddWithValue("@AcPayRecMasterID", item.AcPayRecMasterID);

                        var AcPayRecDetailsreader = selectAcPayRecDetailsSQL.ExecuteReader();

                        item.AcPayRecDetailsDEMCollection = new List<AcPayRecDetailsDEM>();

                        while (AcPayRecDetailsreader.Read())
                        {
                            objAcPayRecDetailsDEM = new AcPayRecDetailsDEM();

                            objAcPayRecDetailsDEM.AcPayRecDetailID = Convert.ToInt32(AcPayRecDetailsreader["AcPayRecDetailID"]);
                            objAcPayRecDetailsDEM.AcPayRecMasterID = Convert.ToInt32(AcPayRecDetailsreader["AcPayRecMasterID"]);
                            objAcPayRecDetailsDEM.MemberID = Convert.ToInt32(AcPayRecDetailsreader["MemberID"]);
                            objAcPayRecDetailsDEM.MemberName = Convert.ToString(AcPayRecDetailsreader["MemberName"]);
                            objAcPayRecDetailsDEM.Amount = Convert.ToInt32(AcPayRecDetailsreader["Amount"]);

                            item.AcPayRecDetailsDEMCollection.Add(objAcPayRecDetailsDEM);
                        }

                    }

                    connection.Close();
                }


                return lstAcPayRecMasterDEM;
            }

            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        [Route("SelectAcPayRecDetailWithMemberID")]
        public IEnumerable<DebitOutstandingDEM> SelectAcPayRecDetailWithMemberID([FromBody] AcPayRecDetailsDEM objAcPayRecDetailsDEM)
        {
            try
            {
                List<DebitOutstandingDEM> lstDebitOutstandingDEM = new List<DebitOutstandingDEM>();
                using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
                {
                    connection.Open();

                    var selectAcPayRecDetailsSQL = new SqliteCommand("select a.BillName, c.GroupID,  c.GroupName, b.Amount, d.MemberID, d.MemberName " +
                        "from AcPayRecDetails b, AcPayRecMaster a, GroupTbl c, MemberTbl d " +
                        "where a.AcPayRecMasterID = b.AcPayRecMasterID and a.GroupID = c.GroupID and a.PaidBy = d.MemberID and b.MemberID = @MemberID", connection);

                    selectAcPayRecDetailsSQL.Parameters.AddWithValue("@MemberID", objAcPayRecDetailsDEM.MemberID);


                    var reader = selectAcPayRecDetailsSQL.ExecuteReader();

                    DebitOutstandingDEM objDebitOutstandingDEM = null;

                    while (reader.Read())
                    {
                        objDebitOutstandingDEM = new DebitOutstandingDEM();

                        objDebitOutstandingDEM.BillName = Convert.ToString(reader["BillName"]);
                        objDebitOutstandingDEM.GroupID = Convert.ToInt32(reader["GroupID"]);
                        objDebitOutstandingDEM.GroupName = Convert.ToString(reader["GroupName"]);
                        objDebitOutstandingDEM.Amount = Convert.ToInt32(reader["Amount"]);
                        objDebitOutstandingDEM.MemberID = Convert.ToInt32(reader["MemberID"]);
                        objDebitOutstandingDEM.MemberName = Convert.ToString(reader["MemberName"]);

                        lstDebitOutstandingDEM.Add(objDebitOutstandingDEM);
                    }

                    connection.Close();
                }


                return lstDebitOutstandingDEM;
            }

            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("SplitBill")]
        public HttpResponseMessage SplitBill([FromBody] AcPayRecMasterDEM objAcPayRecMasterDEM)
        {
            try
            {

                using (var connection = new SqliteConnection("Data Source=D:\\sqlite\\SQLiteStudio\\BillSplit.db"))
                {
                    connection.Open();

                    // var sqlStr = "INSERT INTO GroupTbl (GroupName, purge) VALUES (" + ""+ GroupName + "" + "," + Purge + ") RETURNING GroupID;";


                    var insertSQL = new SqliteCommand("insert into AcPayRecMaster (GroupID, TotalAmount, PaidBy, BillName) " +
                        "Values (@GroupID, @TotalAmount, @PaidBy, '@BillName') RETURNING AcPayRecMasterID;", connection);
                    insertSQL.Parameters.AddWithValue("@GroupID", objAcPayRecMasterDEM.GroupID);
                    insertSQL.Parameters.AddWithValue("@TotalAmount", objAcPayRecMasterDEM.TotalAmount);
                    insertSQL.Parameters.AddWithValue("@PaidBy", objAcPayRecMasterDEM.PaidBy);
                    insertSQL.Parameters.AddWithValue("@BillName", objAcPayRecMasterDEM.BillName);

                    var re = insertSQL.ExecuteScalar();


                    foreach (var item in objAcPayRecMasterDEM.AcPayRecDetailsDEMCollection)
                    {
                        var insertMapSQL = new SqliteCommand("insert into AcPayRecDetails (AcPayRecMasterID, MemberID, Amount) " +
                            "Values (@AcPayRecMasterID, @MemberID, @Amount)", connection);

                        item.AcPayRecMasterID = Convert.ToInt32(re);

                        insertMapSQL.Parameters.AddWithValue("@AcPayRecMasterID", item.AcPayRecMasterID);
                        insertMapSQL.Parameters.AddWithValue("@MemberID", item.MemberID);
                        insertMapSQL.Parameters.AddWithValue("@Amount", item.Amount);

                        insertMapSQL.ExecuteScalar();
                    }

                    connection.Close();
                }

                HttpResponseMessage httpResponse = new HttpResponseMessage();
                httpResponse.StatusCode = (System.Net.HttpStatusCode)200;
                return httpResponse;
            }

            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
