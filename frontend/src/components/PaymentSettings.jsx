import { useEffect, useState } from "react";

function PaymentSettings() {
  const [settings, setSettings] = useState({
    currencySymbol: "₹",
    currencyPosition: "left",
    thousandSeparator: ",",
    decimalSeparator: ".",
    numberOfDecimals: 2,
    paymentPage: "Payment",
    paymentFooter:
      "Thanks for choosing Ultrakey IT Solutions Private Limited.",
    bank:
      "Bank Name:\nAccount Name:\nAccount Number:\nIFSC Code:",
    genericPayment:
      "Please pay the invoice using the payment instructions provided below.",
    paypalEnabled: false,
    paypalEmail: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("paymentSettings");

    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    setSettings((prev) => ({
      ...prev,
      paypalEnabled: e.target.checked,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "paymentSettings",
      JSON.stringify(settings)
    );

    setMessage("Payment settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Payment Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure payment-related settings for invoices.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-6">

        {/* Currency Symbol */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Currency Symbol
          </label>

          <input
            type="text"
            name="currencySymbol"
            value={settings.currencySymbol}
            onChange={handleChange}
            className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
            placeholder="₹"
          />
        </div>

        {/* Currency Position */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Currency Position
          </label>

          <select
            name="currencyPosition"
            value={settings.currencyPosition}
            onChange={handleChange}
            className="w-full max-w-lg rounded-lg border border-gray-300 bg-white px-3 py-2.5"
          >
            <option value="left">
              Left (₹100.00)
            </option>

            <option value="right">
              Right (100.00₹)
            </option>
          </select>
        </div>

        {/* Thousand Separator */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Thousand Separator
          </label>

          <input
            type="text"
            name="thousandSeparator"
            value={settings.thousandSeparator}
            onChange={handleChange}
            maxLength="1"
            className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
          />
        </div>

        {/* Decimal Separator */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Decimal Separator
          </label>

          <input
            type="text"
            name="decimalSeparator"
            value={settings.decimalSeparator}
            onChange={handleChange}
            maxLength="1"
            className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
          />
        </div>

        {/* Number of Decimals */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Number of Decimals
          </label>

          <input
            type="number"
            name="numberOfDecimals"
            min="0"
            max="4"
            value={settings.numberOfDecimals}
            onChange={handleChange}
            className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
          />
        </div>

        {/* Payment Page */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Payment Page
          </label>

          <select
            name="paymentPage"
            value={settings.paymentPage}
            onChange={handleChange}
            className="w-full max-w-lg rounded-lg border border-gray-300 bg-white px-3 py-2.5"
          >
            <option value="Payment">Payment</option>
            <option value="Invoice Payment">
              Invoice Payment
            </option>
          </select>
        </div>

        {/* Payment Footer */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="font-medium text-gray-700">
            Payment Page Footer
          </label>

          <textarea
            name="paymentFooter"
            value={settings.paymentFooter}
            onChange={handleChange}
            rows="4"
            className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
            placeholder="Payment footer..."
          />
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-6">

          <h3 className="mb-5 text-lg font-semibold text-gray-800">
            Payment Methods
          </h3>

          {/* Bank */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="font-medium text-gray-700">
                Bank
              </label>

              <p className="mt-1 text-xs text-gray-400">
                Displayed on the invoice
              </p>
            </div>

            <textarea
              name="bank"
              value={settings.bank}
              onChange={handleChange}
              rows="5"
              className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="Bank details..."
            />
          </div>

          {/* Generic Payment */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="font-medium text-gray-700">
                Generic Payment
              </label>

              <p className="mt-1 text-xs text-gray-400">
                Displayed on the invoice
              </p>
            </div>

            <textarea
              name="genericPayment"
              value={settings.genericPayment}
              onChange={handleChange}
              rows="5"
              className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="Payment instructions..."
            />
          </div>

          {/* PayPal */}
          <div className="mt-6 rounded-lg border border-gray-200 p-4">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.paypalEnabled}
                onChange={handleCheckbox}
                className="h-4 w-4"
              />

              <span className="font-medium text-gray-700">
                Enable PayPal Gateway
              </span>
            </label>

            {settings.paypalEnabled && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PayPal Email
                </label>

                <input
                  type="email"
                  name="paypalEmail"
                  value={settings.paypalEmail}
                  onChange={handleChange}
                  placeholder="paypal@example.com"
                  className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </div>
            )}

          </div>

        </div>

      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
      >
        Save
      </button>

    </div>
  );
}

export default PaymentSettings;