using Sabio.Models;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.Donations;
using System;

namespace Sabio.Services
{
    public interface IDonationService
    {
        int Add(DonationAddRequest model, int userId);
        Donation GetByCharityId(int charitableFundId);
        Donation GetById(int id);
        Paged<Donation> PaginationCreatedBy(int createdBy, int pageIndex, int pageSize);
        Paged<Donation> PaginationDateRange(DateTime dateStart, DateTime dateEnd, int pageIndex, int pageSize);
    }
}