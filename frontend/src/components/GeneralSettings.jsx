import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/general-settings/";

const DEFAULT_SETTINGS = {
  yearStart: "01 Apr",
  yearEnd: "31 Mar",
  predefinedItems:
    "1 | Web Development | 25000 | Website development service\n" +
    "1 | Web Hosting for 1 year | 2500 | Web hosting space for 1 year\n" +
    "1 | SSL Certificate for 1 Year | 1200 | SSL certificate for one year",
};

function GeneralSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsId, setSettingsId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // GET GENERAL SETTINGS
  // --------------------------------------------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Failed to load settings (${response.status})`);
        }

        const data = await response.json();

        console.log("General Settings API:", data);

        if (Array.isArray(data) && data.length > 0) {
          const saved = data[0];

          setSettingsId(saved.id);

          setSettings({
            yearStart: saved.year_start || DEFAULT_SETTINGS.yearStart,
            yearEnd: saved.year_end || DEFAULT_SETTINGS.yearEnd,
            predefinedItems:
              saved.predefined_items || DEFAULT_SETTINGS.predefinedItems,
          });
        }
      } catch (error) {
        console.error("General Settings GET Error:", error);

        setMessage("Unable to load general settings.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // --------------------------------------------------
  // HANDLE INPUT CHANGES
  // --------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // SAVE GENERAL SETTINGS
  // --------------------------------------------------
  const handleSave = async () => {
    if (saving) return;

    setMessage("");
    setMessageType("");
    setSaving(true);

    const requestData = {
      year_start: settings.yearStart,
      year_end: settings.yearEnd,
      predefined_items: settings.predefinedItems.trim(),
    };

    try {
      let response;

      if (settingsId) {
        // Update existing settings
        response = await fetch(`${API_URL}${settingsId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // Create settings for the first time
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Save error:", responseData);

        throw new Error(
          responseData.detail ||
            responseData.error ||
            "Failed to save general settings."
        );
      }

      // Store database ID after POST
      setSettingsId(responseData.id);

      setMessage("General settings saved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("General Settings Save Error:", error);

      setMessage(
        error.message || "Failed to save general settings."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />

          <p className="text-gray-600">
            Loading general settings...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          General Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure general options for your quotation and invoice
          system.
        </p>
      </div>

      {/* Information */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          ℹ️ Configure the financial year and predefined line items
          used throughout the application.
        </p>
      </div>

      {/* Success / Error Message */}
      {message && (
        <div
          className={`mb-5 rounded-lg border p-4 text-sm ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">

        {/* Year Start */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center">
          <label
            htmlFor="yearStart"
            className="font-medium text-gray-700"
          >
            Year Start
          </label>

          <div className="md:col-span-2">
            <select
              id="yearStart"
              name="yearStart"
              value={settings.yearStart}
              onChange={handleChange}
              className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="01 Jan">01 Jan</option>
              <option value="01 Feb">01 Feb</option>
              <option value="01 Mar">01 Mar</option>
              <option value="01 Apr">01 Apr</option>
              <option value="01 May">01 May</option>
              <option value="01 Jun">01 Jun</option>
              <option value="01 Jul">01 Jul</option>
              <option value="01 Aug">01 Aug</option>
              <option value="01 Sep">01 Sep</option>
              <option value="01 Oct">01 Oct</option>
              <option value="01 Nov">01 Nov</option>
              <option value="01 Dec">01 Dec</option>
            </select>

            <p className="mt-1 text-xs text-gray-400">
              The start date of the fiscal year.
            </p>
          </div>
        </div>

        {/* Year End */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center">
          <label
            htmlFor="yearEnd"
            className="font-medium text-gray-700"
          >
            Year End
          </label>

          <div className="md:col-span-2">
            <select
              id="yearEnd"
              name="yearEnd"
              value={settings.yearEnd}
              onChange={handleChange}
              className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="31 Jan">31 Jan</option>
              <option value="28 Feb">28 Feb</option>
              <option value="31 Mar">31 Mar</option>
              <option value="30 Apr">30 Apr</option>
              <option value="31 May">31 May</option>
              <option value="30 Jun">30 Jun</option>
              <option value="31 Jul">31 Jul</option>
              <option value="31 Aug">31 Aug</option>
              <option value="30 Sep">30 Sep</option>
              <option value="31 Oct">31 Oct</option>
              <option value="30 Nov">30 Nov</option>
              <option value="31 Dec">31 Dec</option>
            </select>

            <p className="mt-1 text-xs text-gray-400">
              The end date of the fiscal year.
            </p>
          </div>
        </div>

        {/* Predefined Line Items */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <label
              htmlFor="predefinedItems"
              className="font-medium text-gray-700"
            >
              Pre-Defined Line Items
            </label>

            <p className="mt-1 text-xs text-gray-400">
              These items can be reused while creating invoices and
              quotations.
            </p>
          </div>

          <div className="md:col-span-2">
            <textarea
              id="predefinedItems"
              name="predefinedItems"
              value={settings.predefinedItems}
              onChange={handleChange}
              rows={7}
              placeholder="1 | Web Design | 5000 | Designing the website"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500">
              <p>
                Add one line item per line using:
              </p>

              <p className="mt-1 font-semibold text-gray-700">
                Qty | Title | Price | Description
              </p>

              <p className="mt-1">
                Example:
              </p>

              <p className="font-mono">
                1 | Web Design | 5000 | Designing the website
              </p>

              <p className="mt-1">
                Each field must be separated by the <strong>|</strong>{" "}
                symbol. Price should contain numbers only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default GeneralSettings;