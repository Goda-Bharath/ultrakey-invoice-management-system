import { useEffect, useState } from "react";

function TaxSettings() {
  const [settings, setSettings] = useState({
    pricesInclusive: false,
    taxPercentage: 18,
    taxName: "GST (18%)",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("taxSettings");

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

  const handleSave = () => {
    localStorage.setItem(
      "taxSettings",
      JSON.stringify(settings)
    );

    setMessage("Tax settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Tax Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure tax-related settings.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-7">

        {/* Prices entered with tax */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="font-medium text-gray-700">
              Prices entered with tax
            </label>
          </div>

          <div className="space-y-3 md:col-span-2">

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="pricesInclusive"
                checked={settings.pricesInclusive === true}
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    pricesInclusive: true,
                  }))
                }
              />

              <span className="text-sm text-gray-700">
                Yes, I will enter prices inclusive of tax
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="pricesInclusive"
                checked={settings.pricesInclusive === false}
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    pricesInclusive: false,
                  }))
                }
              />

              <span className="text-sm text-gray-700">
                No, I will enter prices exclusive of tax
              </span>
            </label>

          </div>
        </div>

        {/* Tax Percentage */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">

          <label className="font-medium text-gray-700">
            Tax Percentage
          </label>

          <div className="md:col-span-2">

            <input
              type="number"
              name="taxPercentage"
              value={settings.taxPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
            />

            <p className="mt-1 text-xs text-gray-400">
              Default tax percentage. Set to 0 or leave blank for no tax.
            </p>

          </div>

        </div>

        {/* Tax Name */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">

          <label className="font-medium text-gray-700">
            Tax Name
          </label>

          <div className="md:col-span-2">

            <input
              type="text"
              name="taxName"
              value={settings.taxName}
              onChange={handleChange}
              placeholder="GST (18%)"
              className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2.5"
            />

            <p className="mt-1 text-xs text-gray-400">
              The name of the tax for your country/region.
            </p>

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

export default TaxSettings;