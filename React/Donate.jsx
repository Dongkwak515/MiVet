import React, { useState, Fragment } from "react";
import { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import * as donateService from "services/donateService";
import { useNavigate } from "react-router-dom";
import "./donate.css";
import toastr from "toastr";
import debug from "sabio-debug";

const _logger = debug.extend("Donate");

const clientId = process.env.REACT_APP_PAYPAL_SANDBOX_API_KEY;

function Donate() {
    const navigate = useNavigate();

    const [price, setPrice] = useState(0);

    const [inputBox, setInputBox] = useState(false);

    const [charitableData, setCharitableData] = useState({
        charitableFunds: [],
        currentCharitableFunds: [],
        selectedCharitableFundId: 0,
        selectedCharitableSummary: "",
        selectedCharitableName: "",
        paymentTransaction: [],
    });

    _logger("Global Payment Transaction", charitableData.paymentTransaction);

    // eslint-disable-next-line no-unused-vars
    const onOtherClick = (e) => {
        setInputBox((current) => !current);
    };

    const onPriceChange = (e) => {
        const price = e.target.value;

        _logger("ON PRICE CHANGE ----->", price);

        if (price >= 10) {
            setPrice(price);

            return price;
        } else {
            toastr.error("Invalid Amount");
        }
    };

    const onPriceClick = (e) => {
        const price = e.target.value;

        setPrice(price);

        _logger("ON PRICE SELECT ----->", price);

        return price;
    };

    useEffect(() => {
        _logger("Firing Use Effect GET All Charitable Funds");
        donateService
            .getAllCharitableFunds()
            .then(onGetAllCharitableFundsSuccess)
            .catch(onAllGetCharitableFundsError);
    }, []);

    const onGetAllCharitableFundsSuccess = (response) => {
        const charitableFunds = response.items;

        setCharitableData((prevState) => {
            const pd = { ...prevState };

            pd.charitableFunds = [...prevState.charitableFunds];
            pd.currentCharitableFunds = charitableFunds.map(mapDropDown);

            _logger("On Get All Charitable Fund Success ----->", pd);

            return pd;
        });
    };

    const onAllGetCharitableFundsError = (err) => {
        _logger("On Get ALL Charitable Fund Error ----->", err);
        toastr.error("Error");
        return err;
    };

    const mapDropDown = (charitableFund) => {
        _logger("Map Drop Down ---->", charitableFund);
        return (
            <option value={charitableFund.id} key={charitableFund.id}>
                {charitableFund.name}
            </option>
        );
    };

    const onSelectChange = (e) => {
        const charitableFundId = e.target.value;

        _logger("ON SELECT CHANGE ----->", charitableFundId);

        donateService
            .getCharitableFund(charitableFundId)
            .then(onGetCharitableFundSuccess)
            .catch(onGetCharitableFundError);

        return charitableFundId;
    };

    const onGetCharitableFundSuccess = (response) => {
        _logger("On Get Charitable Fund Success ----->", response);

        const charitableFundId = response.item.id;

        const charitableSummary = response.item.description;

        const charitableName = response.item.name;

        setCharitableData((prevState) => {
            const pd = { ...prevState };

            pd.selectedCharitableFundId = charitableFundId;
            pd.selectedCharitableSummary = charitableSummary;
            pd.selectedCharitableName = charitableName;

            _logger("On Get Charitable Fund Success pd ----->", pd);
            _logger("On Get Charitable Fund Success Charitable Fund Id ----->", charitableFundId);
            _logger("On Get Charitable Fund Success Charitable Summary --->", charitableSummary);
            _logger("On Get Charitable Fund Success Charitable Name --->", charitableName);

            return pd;
        });
    };

    const onGetCharitableFundError = (err) => {
        _logger("On Get Charitable Fund Error ----->", err);
        toastr.error("Error");
        return err;
    };

    // eslint-disable-next-line react/prop-types
    const ButtonWrapper = ({ currency }) => {
        // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
        // This is the main reason to wrap the PayPalButtons in a new component
        // eslint-disable-next-line no-unused-vars
        const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    currency: currency,
                },
            });
        }, [currency]);

        return (
            <PayPalButtons
                fundingSource="paypal"
                style={{ color: "white", shape: "pill", layout: "vertical", label: "donate" }}
                disabled={false}
                createOrder={(data, actions) => {
                    _logger(
                        "Paypal Create Order Charitable Name",
                        charitableData.selectedCharitableName
                    );
                    return actions.order
                        .create({
                            // eslint-disable-next-line camelcase
                            purchase_units: [
                                {
                                    amount: {
                                        value: price,
                                        breakdown: {
                                            // eslint-disable-next-line camelcase
                                            item_total: {
                                                // eslint-disable-next-line camelcase
                                                currency_code: "USD",
                                                value: price,
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            name: charitableData.selectedCharitableName,
                                            quantity: "1",
                                            // eslint-disable-next-line camelcase
                                            unit_amount: {
                                                // eslint-disable-next-line camelcase
                                                currency_code: "USD",
                                                value: price,
                                            },
                                            category: "DONATION",
                                        },
                                    ],
                                },
                            ],
                        })
                        .then((orderId) => {
                            _logger("Order ID --->", orderId);
                            return orderId;
                        });
                }}
                onApprove={(data, actions) => {
                    // eslint-disable-next-line no-unused-vars
                    return actions.order.get().then((data) => {
                        // Your code here after capture the order
                        _logger("Order RETURN DATA --->", data);

                        const orderData = data.purchase_units[0];

                        const donationAmount = data.purchase_units[0].amount.value;

                        const payload = {
                            charitableFundId: charitableData.selectedCharitableFundId,
                            orderId: data.id,
                            unitCost: parseInt(donationAmount),
                        };
                        _logger(
                            "On Approve Charitable Fund Id --->",
                            charitableData.selectedCharitableFundId
                        );
                        _logger(payload);

                        setCharitableData((prevState) => {
                            const pd = { ...prevState };

                            pd.paymentTransaction = orderData;

                            _logger("On Get Charitable Fund Success pd ----->", pd);

                            return pd;
                        });

                        const onGetDonationAddSuccess = (data) => {
                            _logger("on Get Transaction Success ----->", data);
                            _logger("ADD SUCCESS Payment Transaction", orderData);
                            toastr.success("Confirmed Payment");
                            navigate(`/donationreceipt`, { state: { ...orderData } });
                            return data;
                        };

                        const onGetDonationAddError = (err) => {
                            _logger("on Get Transaction Error ----->", err);
                            toastr.error("Error");
                            return err;
                        };

                        donateService
                            .donationAdd(payload)
                            .then(onGetDonationAddSuccess)
                            .catch(onGetDonationAddError);
                    });
                }}
            />
        );
    };
    return (
        <Fragment>
            <div className="py-4 py-lg-8 pb-14 bg-white">
                <div className="container">
                    <div className="justify-content-center row">
                        <div id="donate" className="container-fluid">
                            <div className="text-center mb-4">
                                <h2 className="display-3 fw-bold mb-4">Donate</h2>
                            </div>
                            <form action="/donate" method="post">
                                <input name="donationForm" type="hidden" />
                                <div className="form-horizontal">
                                    <input
                                        data-val="true"
                                        data-val-required="The SetFund field is required."
                                        id="SetFund"
                                        name="SetFund"
                                        type="hidden"
                                        defaultValue="False"
                                    />
                                    <div className="col-md-12">
                                        <p>
                                            Lending a hand when it is needed most is a quality that
                                            so many equestrians possess. Donations to these various
                                            funds will be put to excellent use, and knowing that you
                                            have made a difference in someones life is a reward that
                                            only you can give yourself.
                                        </p>
                                        <p>
                                            Please take a moment to learn more about each of these
                                            charitable funds and how you might be able to help.
                                        </p>
                                        <p>
                                            Your support offsets the expenses of fielding a team to
                                            represent the United States in international
                                            competition. Some of these expenses include team travel,
                                            accommodations, training sessions, and other related
                                            expenses.
                                        </p>
                                        <p>
                                            Your generous support not only ensures the success of
                                            the Young Rider Program, but also helps to put endurance
                                            in the spotlight.
                                        </p>
                                        <p>Thank you for your generosity and support!</p>
                                        <p>All donations are tax-deductible.</p>
                                    </div>
                                    <div className="row payment-block">
                                        <div className="col-sm-6">
                                            <div className="card-main">
                                                <div className="card-body-main">
                                                    <label
                                                        className="control-label col-x-3"
                                                        htmlFor="DonationRef_uid"
                                                    >
                                                        <h4>List of programs to donate to:</h4>
                                                    </label>
                                                    <div className="col-md-12">
                                                        <select
                                                            className="form-control col-md-12"
                                                            value={
                                                                charitableData.selectedCharitableFundId
                                                            }
                                                            onChange={onSelectChange}
                                                        >
                                                            <option value={""}>
                                                                Select Donation from the list
                                                            </option>
                                                            {charitableData.currentCharitableFunds}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12 preset-amount-wrapper">
                                                        <h4>Please select amount to Donate:</h4>
                                                    </div>
                                                    <div className="row">
                                                        <div className="preset-amount-wrapper">
                                                            <div className="styles-module_single_selection_group_wrapper__f6Y6v styles-module_normal_desktop_boxes__F-zcF">
                                                                <fieldset className="ppvx_selection-group___3-14-10 ppvx--v2___3-14-10">
                                                                    <div className="ppvx_selection-group__buttons___3-14-10 ppvx_selection-group__buttons--justify___3-14-10 radio-button">
                                                                        <input
                                                                            type="radio"
                                                                            name="preset-amounts"
                                                                            id="selection_preset-amounts_100.00"
                                                                            className="ppvx_selection__control___3-14-10"
                                                                            defaultValue={100}
                                                                            onClick={onPriceClick}
                                                                        />
                                                                        <label
                                                                            className="ppvx_selection__label___3-14-10"
                                                                            htmlFor="selection_preset-amounts_100.00"
                                                                        >
                                                                            $100
                                                                            <span className="ppvx_selection__label--secondary-label___3-14-10">
                                                                                USD
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            type="radio"
                                                                            name="preset-amounts"
                                                                            id="selection_preset-amounts_200.00"
                                                                            className="ppvx_selection__control___3-14-10"
                                                                            defaultValue={200}
                                                                            onClick={onPriceClick}
                                                                        />
                                                                        <label
                                                                            className="ppvx_selection__label___3-14-10"
                                                                            htmlFor="selection_preset-amounts_200.00"
                                                                        >
                                                                            $200
                                                                            <span className="ppvx_selection__label--secondary-label___3-14-10">
                                                                                USD
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            type="radio"
                                                                            name="preset-amounts"
                                                                            id="selection_preset-amounts_300.00"
                                                                            className="ppvx_selection__control___3-14-10"
                                                                            defaultValue={300}
                                                                            onClick={onPriceClick}
                                                                        />
                                                                        <label
                                                                            className="ppvx_selection__label___3-14-10"
                                                                            htmlFor="selection_preset-amounts_300.00"
                                                                        >
                                                                            $300
                                                                            <span className="ppvx_selection__label--secondary-label___3-14-10">
                                                                                USD
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            type="radio"
                                                                            name="preset-amounts"
                                                                            id="selection_preset-amounts_Other"
                                                                            className="ppvx_selection__control___3-14-10"
                                                                            defaultValue="Other"
                                                                            onClick={onOtherClick}
                                                                        />
                                                                        <label
                                                                            className="ppvx_selection__label___3-14-10"
                                                                            htmlFor="selection_preset-amounts_Other"
                                                                        >
                                                                            Other
                                                                        </label>
                                                                    </div>
                                                                </fieldset>
                                                            </div>
                                                        </div>
                                                        <p
                                                            id="descriptionError"
                                                            className="donate-descriptionError"
                                                        />
                                                        {inputBox && (
                                                            <div className="col-md-6">
                                                                <label
                                                                    className="control-label required-field"
                                                                    htmlFor="DonationInfo_DonationAmount"
                                                                >
                                                                    Please enter above $10 USD
                                                                    <span
                                                                        className="field-validation-error text-danger required-field-icon"
                                                                        data-valmsg-for="DonationInfo.DonationAmount"
                                                                        data-valmsg-replace="true"
                                                                    >
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    className="input-validation-error form-control col-md-6 text-box single-line"
                                                                    data-val="true"
                                                                    data-val-number="The field Donation Amount must be a number."
                                                                    data-val-range="Please enter a donation amount greater than 10."
                                                                    data-val-range-max="1.79769313486232E+308"
                                                                    data-val-range-min={10}
                                                                    data-val-required="Donation Amount is required."
                                                                    onChange={onPriceChange}
                                                                    id="DonationInfo_DonationAmount"
                                                                    name="DonationInfo.DonationAmount"
                                                                    type="number"
                                                                />
                                                            </div>
                                                        )}
                                                        <p
                                                            id="priceLabelError"
                                                            className=".donate-descriptionError"
                                                        />
                                                        <div
                                                            className="donate-price-input"
                                                            id="paypal-button-container"
                                                        />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12 ps-0 ms-2 ms-md-0">
                                                            <div
                                                                style={{
                                                                    maxWidth: "750px",
                                                                    minHeight: "200px",
                                                                }}
                                                            >
                                                                <PayPalScriptProvider
                                                                    options={{
                                                                        "client-id": clientId,
                                                                        components: "buttons",
                                                                        currency: "USD",
                                                                    }}
                                                                >
                                                                    <ButtonWrapper
                                                                        currency={"USD"}
                                                                    />
                                                                </PayPalScriptProvider>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="card-main">
                                                <div className="card-body-main">
                                                    <div className="col-md-12">
                                                        <h4>Donation Program information:</h4>
                                                        <p>
                                                            {
                                                                charitableData.selectedCharitableSummary
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="justify-content-center row"
                                        id="smart-button-container"
                                    >
                                        <br />
                                        <div className="help-block">
                                            <p>
                                                At this time, we are unable to solicit donations
                                                from residents of&nbsp;Connecticut, Maine, New
                                                York,&nbsp;Rhode Island or Washington.
                                            </p>
                                        </div>
                                        <p className="legal-disclaimer">
                                            FLORIDA: A COPY OF THE OFFICIAL REGISTRATION AND
                                            FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION
                                            OF CONSUMER SERVICES BY CALLING TOLL-FREE 1-800-HELP-FLA
                                            OR ONLINE AT www.FloridaConsumerHelp.com, REGISTRATION
                                            DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION
                                            BY THE STATE. FLORIDA REGISTRATION #: CH27805
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Donate;
