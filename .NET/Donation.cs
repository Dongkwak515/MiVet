using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Donations
{
    public class Donation
    {
        public int Id { get; set; }
        public int CharitableFundId { get; set; }
        public string OrderId { get; set; }
        public int UnitCost { get; set; }
        public int CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }

    }
}
