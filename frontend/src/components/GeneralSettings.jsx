import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/general-settings/";

function GeneralSettings() {
  const [settings, setSettings] = useState({
    yearStart: "01 Apr",
    yearEnd: "31 Mar",
    predefinedItems:
      "1 | Web Development | 25000 | Website development service\n" +
      "1 | Web Hosting for 1 year | 2500 | Web hosting space for 1 year\n" +
      "1 | SSL Certificate for 1 Year | 1200 | SSL certificate for one year",
  });

  const [settingsId, setSettingsId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // GET settings from Django
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }
        return response.json();
      })
      .then((data) => {
        console.log("General Settings API:", data);

        if (data.length > 0) {
          const saved = data[0];

          setSettingsId(saved.id);

          setSettings({
            yearStart: saved.year_start || "01 Apr",
            yearEnd: saved.year_end || "31 Mar",
            predefinedItems: saved.predefined_items || "",
          });
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setMessage("Unable to load settings.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save settings to Django
  const handleSave = async () => {
    setMessage("");

    const data = {
      year_start: settings.yearStart,
      year_end: settings.yearEnd,
      predefined_items: settings.predefinedItems,
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
          body: JSON.stringify(data),
        });
      } else {
        // Create new settings
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Save error:", errorData);
        throw new Error("Failed to save settings");
      }

      const savedData = await response.json();

      setSettingsId(savedData.id);

      setMessage("General settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save general settings.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          General Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure general options for your quotation and invoice system.
        </p>
      </div>

      {/* Information box */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          ℹ️ Just some general options.
        </p>
      </div>

      {/* Success / Error message */}
      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-6">

        {/* Year Start */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Year Start
          </label>

          <div className="md:col-span-2">
            <select
              name="yearStart"
              value={settings.yearStart}
              onChange={handleChange}
              className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-gray-500"
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
              The start date of the fiscal year
            </p>
          </div>
        </div>

        {/* Year End */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center">
          <label className="font-medium text-gray-700">
            Year End
          </label>

          <div className="md:col-span-2">
            <select
              name="yearEnd"
              value={settings.yearEnd}
              onChange={handleChange}
              className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-gray-500"
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
              The end date of the fiscal year
            </p>
          </div>
        </div>

        {/* Predefined Items */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <label className="font-medium text-gray-700">
              Pre-Defined Line Items
            </label>
          </div>

          <div className="md:col-span-2">
            <textarea
              name="predefinedItems"
              value={settings.predefinedItems}
              onChange={handleChange}
              rows="7"
              placeholder="1 | Web Design | 5000 | Designing the website"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 font-mono text-sm outline-none focus:border-gray-500"
            />

            <p className="mt-2 text-xs leading-5 text-gray-400">
              Add one line item per line in this format:
              <br />
              <strong>
                Qty | Title | Price | Description
              </strong>
              <br />
              Each field is separated by the | symbol.
              <br />
              Price should contain numbers only.
            </p>
          </div>
        </div>

      </div>

      {/* Save */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>

    </div>
  );
}

export default GeneralSettings;