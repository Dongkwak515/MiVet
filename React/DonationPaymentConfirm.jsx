/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
import { React } from "react";
import { useLocation } from "react-router-dom";
import "./donate.css";
import debug from "sabio-debug";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("DonatePaymentConfirm");

function DonatePaymentReceipt() {
    const navigate = useNavigate();
    const location = useLocation();
    _logger("Use Location", location);

    const onNavigate = () => {
        navigate(`/donate`);
    };

    return (
        <div id="bf3_desktop_preview_wrapper" role="region" aria-label="Desktop Preview">
            <div id="bf3_desktop_preview_main">
                <div id="bf3_desktop_preview_container" className="landing_page_preview_container">
                    <div className="common-preview-container ">
                        <div className="ppvx_container___2-7-10 common-preview-component no-banner-padding">
                            <div className="ppvx_row___2-7-10 common-preview-component-logo-container">
                                <img
                                    src="https://pics.paypal.com/00/s/MGM1NmEzNTgtMmQ0NS00YTIwLWJjMTktMjU2YjM2OWJiNDEz/file.PNG"
                                    className="center-aligned"
                                    aria-hidden="true"
                                    data-testid="logo-preview"
                                />
                            </div>
                            <div className="ppvx_row___2-7-10">
                                <div className="ppvx_text--body___5-8-5 common-preview-component-header center-aligned bf-margin-top-24 ppvx--v2___5-8-5">
                                    Donated to
                                </div>
                            </div>
                            <div className="ppvx_row___2-7-10">
                                <div className="ppvx_text--heading-sm___5-8-5 common-preview-component-receiver center-aligned ppvx--v2___5-8-5">
                                    MiVet
                                </div>
                            </div>
                            <div className="ppvx_row___2-7-10">
                                <div className="ppvx_text--body___5-8-5 common-preview-component-purpose center-aligned ppvx--v2___5-8-5">
                                    <p>
                                        Donations to these various funds will be put to excellent
                                        use. You have made a difference in someone's life.
                                    </p>
                                </div>
                            </div>
                            <div className="ppvx_col___2-7-10 styles-module_amountHolder__hn-2p">
                                <div className="ppvx_row___2-7-10 ppvx_justify-content-center___2-7-10">
                                    <div className="inputField">
                                        <div className="money_input">
                                            <div className="ppvx_text--heading-sm___5-8-5 amount-currency-symbol styles-module_amountCurrency__8cx-o ppvx--v2___5-8-5">
                                                ${location.state.amount.value} USD
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-dark common-preview-component-purpose col-11">
                                <div className="card-header">Use this donation for</div>
                                <div className="card-body text-dark">
                                    <h5 className="card-title">{location.state.items[0].name}</h5>
                                </div>
                            </div>
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary return-btn"
                                    onClick={onNavigate}
                                >
                                    Go back to donation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonatePaymentReceipt;
