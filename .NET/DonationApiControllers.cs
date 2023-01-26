using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.Donations;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/donations")]
    [ApiController]
    public class DonationApiControllers : BaseApiController
    {
        private IDonationService _service = null;

        private IAuthenticationService<int> _authService = null;

        public DonationApiControllers(IDonationService service
            , ILogger<DonationApiControllers> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Donation>> GetById(int id)
        {
            int iCode = 200;

            BaseResponse response = null;

            try
            {
                Donation donation = _service.GetById(id);

                if (donation == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Donation> { Item = donation };
                }
            }
            catch(Exception ex)
            {
                iCode = 500;

                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("charitablefundId/{charitableFundId:int}")]
        public ActionResult<ItemResponse<Donation>> GetByCharityId(int charitableFundId)
        {
            int iCode = 200;

            BaseResponse response = null;

            try
            {
                Donation donation = _service.GetByCharityId(charitableFundId);

                if (donation == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Donation> { Item = donation };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(DonationAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("search/createdby")]
        public ActionResult<ItemResponse<Paged<Donation>>> PaginationCreatedBy(int createdBy, int pageIndex, int pageSize)
        {
            int code = 200;

            BaseResponse response = null; ;

            try
            {
                Paged<Donation> page = _service.PaginationCreatedBy(createdBy, pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Donation>> { Item = page };
                }
            }
            catch(Exception ex )
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response); ;
        }

        [HttpGet("search/date")]
        public ActionResult<ItemResponse<Paged<Donation>>> PaginationDateRange(DateTime dateStart, DateTime dateEnd, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Donation> page = _service.PaginationDateRange(dateStart, dateEnd, pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Donation>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

    }
}
