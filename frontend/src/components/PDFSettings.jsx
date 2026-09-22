import { useState } from "react";

function PDFSettings() {
  const [template, setTemplate] = useState(
    localStorage.getItem("pdfTemplate") || "classic"
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      "pdfTemplate",
      template
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          PDF Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Select the template used when downloading
          invoices and quotations as PDF.
        </p>


        {/* Template Card */}

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-lg font-bold text-gray-800">
            PDF Template
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose a template for your invoice and quotation PDFs.
          </p>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Classic */}

            <label
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition
                ${
                  template === "classic"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
            >

              <input
                type="radio"
                name="template"
                value="classic"
                checked={template === "classic"}
                onChange={(e) =>
                  setTemplate(e.target.value)
                }
                className="sr-only"
              />

              <div className="h-32 rounded border bg-white p-3">

                <div className="text-sm font-bold">
                  Ultrakey
                </div>

                <div className="mt-2 h-px bg-gray-300" />

                <div className="mt-3 space-y-2">
                  <div className="h-2 w-3/4 rounded bg-gray-200" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-2/3 rounded bg-gray-200" />
                </div>

              </div>

              <p className="mt-3 font-semibold text-gray-800">
                Classic
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Traditional invoice layout.
              </p>

            </label>


            {/* Modern */}

            <label
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition
                ${
                  template === "modern"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
            >

              <input
                type="radio"
                name="template"
                value="modern"
                checked={template === "modern"}
                onChange={(e) =>
                  setTemplate(e.target.value)
                }
                className="sr-only"
              />

              <div className="h-32 rounded border bg-white p-3">

                <div className="flex justify-between">
                  <div className="text-sm font-bold">
                    Ultrakey
                  </div>

                  <div className="text-xs font-bold">
                    INVOICE
                  </div>
                </div>

                <div className="mt-3 h-px bg-gray-300" />

                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-4/5 rounded bg-gray-200" />
                  <div className="h-2 w-3/5 rounded bg-gray-200" />
                </div>

              </div>

              <p className="mt-3 font-semibold text-gray-800">
                Modern
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Clean modern invoice layout.
              </p>

            </label>


            {/* Minimal */}

            <label
              className={`
                cursor-pointer rounded-lg border-2 p-4 transition
                ${
                  template === "minimal"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
            >

              <input
                type="radio"
                name="template"
                value="minimal"
                checked={template === "minimal"}
                onChange={(e) =>
                  setTemplate(e.target.value)
                }
                className="sr-only"
              />

              <div className="h-32 rounded border bg-white p-3">

                <div className="text-sm">
                  Ultrakey
                </div>

                <div className="mt-3 space-y-2">
                  <div className="h-1 w-full bg-gray-300" />
                  <div className="h-1 w-4/5 bg-gray-300" />
                  <div className="h-1 w-3/5 bg-gray-300" />
                </div>

              </div>

              <p className="mt-3 font-semibold text-gray-800">
                Minimal
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Simple lightweight invoice layout.
              </p>

            </label>

          </div>


          {/* Save */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">

            <button
              onClick={handleSave}
              className="
                w-full rounded-md bg-blue-600
                px-5 py-2.5 text-sm font-semibold
                text-white transition hover:bg-blue-700
                sm:w-auto
              "
            >
              Save PDF Settings
            </button>

            {saved && (
              <span className="text-sm font-medium text-green-600">
                ✓ PDF template saved.
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default PDFSettings;