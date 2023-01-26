using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.CharitableFunds;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.Donations;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class DonationService : IDonationService
    {
        IDataProvider _data = null;

        public DonationService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(DonationAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Donations_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnColllection)
                {
                    Object oId = returnColllection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);

                });

            return id;
        }

        public Donation GetByCharityId(int charitableFundId)
        {
            string procName = "[dbo].[Donations_Select_ByCharityId]";

            Donation donation = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@CharitableFundId", charitableFundId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                donation = MapSingleDonation(reader, ref startingIndex);
            }
            );
            return donation;
        }

        public Donation GetById(int id)
        {
            string procName = "[dbo].[Donations_Select_ById]";

            Donation donation = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                donation = MapSingleDonation(reader, ref startingIndex);
            }
            );
            return donation;
        }

        public Paged<Donation> PaginationCreatedBy(int createdBy, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Donations_Select_ByCreatedBy_Paginated]";

            Paged<Donation> pageList = null;

            List<Donation> list = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@CreatedBy", createdBy);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Donation donation = MapSingleDonation(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Donation>();
                }
                list.Add(donation);
            });
            if (list != null)
            {
                pageList = new Paged<Donation>(list, pageIndex, pageSize, totalCount);
            }
            return pageList;
        }

        public Paged<Donation> PaginationDateRange(DateTime dateStart, DateTime dateEnd, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Donations_Select_Summary_ByDateRange]";

            Paged<Donation> pageList = null;

            List<Donation> list = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@DateStart", dateStart);
                param.AddWithValue("@DateEnd", dateEnd);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Donation donation = MapSingleDonation(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Donation>();
                }
                list.Add(donation);
            });
            if (list != null)
            {
                pageList = new Paged<Donation>(list, pageIndex, pageSize, totalCount);
            }
            return pageList;
        }

        private static void AddCommonParams(DonationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@CharitableFundId", model.CharitableFundId);
            col.AddWithValue("@OrderId", model.OrderId);
            col.AddWithValue("@UnitCost", model.UnitCost);
        }

        private static Donation MapSingleDonation(IDataReader reader, ref int startingIndex)
        {
            Donation aDonation = new Donation();

            aDonation.Id = reader.GetSafeInt32(startingIndex++);
            aDonation.CharitableFundId = reader.GetSafeInt32(startingIndex++);
            aDonation.OrderId = reader.GetSafeString(startingIndex++);
            aDonation.UnitCost = reader.GetSafeInt32(startingIndex++);
            aDonation.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aDonation.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return aDonation;
        }
    }
}
