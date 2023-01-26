using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Donations
{
    public class DonationAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int CharitableFundId { get; set; }

        [Required]
        [StringLength(250, MinimumLength =2)]
        public string OrderId { get; set; }

        [Required]
        [Range(100, Int32.MaxValue)]
        public int UnitCost { get; set; }

    }
}
