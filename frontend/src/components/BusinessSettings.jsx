import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/business-settings/";

function BusinessSettings() {
  const [settingsId, setSettingsId] = useState(null);

  const [settings, setSettings] = useState({
    business_name: "",
    address: "",
    extra_info: "",
    website: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD SETTINGS
  // =========================
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Business Settings:", data);

        if (data.length > 0) {
          const saved = data[0];

          setSettingsId(saved.id);

          setSettings({
            business_name: saved.business_name || "",
            address: saved.address || "",
            extra_info: saved.extra_info || "",
            website: saved.website || "",
          });

          if (saved.logo) {
            setLogoPreview(
              saved.logo.startsWith("http")
                ? saved.logo
                : `http://127.0.0.1:8000${saved.logo}`
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load business settings.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // LOGO
  // =========================
  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    setMessage("");
    setSaving(true);

    const formData = new FormData();

    formData.append("business_name", settings.business_name);
    formData.append("address", settings.address);
    formData.append("extra_info", settings.extra_info);
    formData.append("website", settings.website);

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      let response;

      if (settingsId) {
        response = await fetch(`${API_URL}${settingsId}/`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Save error:", errorData);
        throw new Error("Failed to save settings");
      }

      const savedData = await response.json();

      setSettingsId(savedData.id);

      if (savedData.logo) {
        setLogoPreview(
          savedData.logo.startsWith("http")
            ? savedData.logo
            : `http://127.0.0.1:8000${savedData.logo}`
        );
      }

      setMessage("Business settings updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save business settings.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-7 w-56 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
            <div className="mt-10 h-40 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">

          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Settings</span>
              <span>/</span>
              <span className="text-slate-700">Business</span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Business settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your company information and branding.
            </p>
          </div>

          {/* Desktop Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:block"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Success Message */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
              ✓
            </div>

            <span>{message}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* =========================
              LEFT COLUMN
          ========================= */}
          <div className="space-y-6">

            {/* Company Information */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Company information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information shown on invoices and quotations.
                </p>
              </div>

              <div className="space-y-6 p-5 sm:p-6">

                {/* Business Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Business name
                  </label>

                  <input
                    type="text"
                    name="business_name"
                    value={settings.business_name}
                    onChange={handleChange}
                    placeholder="Ultrakey IT Solutions Private Limited"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Your registered business or company name.
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Business address
                  </label>

                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter your complete business address"
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Website
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      🌐
                    </span>

                    <input
                      type="url"
                      name="website"
                      value={settings.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Additional Information */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Additional information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Optional details such as GST, registration or contact
                  information.
                </p>
              </div>

              <div className="p-5 sm:p-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Extra information
                </label>

                <textarea
                  name="extra_info"
                  value={settings.extra_info}
                  onChange={handleChange}
                  rows={5}
                  placeholder="GST Number, phone number, registration details, etc."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

              </div>
            </section>

          </div>

          {/* =========================
              RIGHT COLUMN
          ========================= */}
          <aside className="space-y-6">

            {/* Brand */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Brand identity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload your company logo.
                </p>
              </div>

              <div className="p-5">

                {/* Logo Preview */}
                <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">

                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business Logo"
                      className="max-h-40 max-w-[80%] object-contain"
                    />
                  ) : (
                    <div className="text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200">
                        🏢
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No logo uploaded
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG or WEBP
                      </p>

                    </div>
                  )}

                </div>

                {/* Upload */}
                <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">

                  <span>Choose logo</span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                </label>

                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Recommended: square logo with a transparent background.
                </p>

              </div>
            </section>

            {/* Preview Card */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Invoice preview
                </h3>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  Preview
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-2">

                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt=""
                        className="h-9 w-9 rounded-lg object-contain bg-white"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs text-white">
                        U
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {settings.business_name || "Your Business"}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Invoice
                      </p>
                    </div>

                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">
                      Invoice
                    </p>

                    <p className="text-xs font-semibold text-slate-800">
                      #INV-001
                    </p>
                  </div>

                </div>

                <div className="mt-5 h-px bg-slate-200" />

                <div className="mt-4 space-y-2">
                  <div className="h-2 w-24 rounded bg-slate-200" />
                  <div className="h-2 w-32 rounded bg-slate-200" />
                  <div className="h-2 w-20 rounded bg-slate-200" />
                </div>

                <div className="mt-5 flex justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-400">
                    Total
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    ₹25,000
                  </span>
                </div>

              </div>

            </section>

          </aside>

        </div>

        {/* =========================
            MOBILE SAVE
        ========================= */}
        <div className="mt-6 sm:hidden">

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

        </div>

      </main>
    </div>
  );
}

export default BusinessSettings;