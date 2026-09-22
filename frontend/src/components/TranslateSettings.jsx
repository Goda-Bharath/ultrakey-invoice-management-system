import { useEffect, useState } from "react";

function TranslateSettings() {
  const [settings, setSettings] = useState({
    quoteLabel: "Quote",
    quoteLabelPlural: "Quotes",

    invoiceLabel: "Invoice",
    invoiceLabelPlural: "Invoices",

    hrsQty: "Hrs/Qty",
    service: "Service",
    ratePrice: "Rate/Price",
    adjust: "Adjust",

    subTotal: "Sub Total",
    discount: "Discount",
    total: "Total",
    totalDue: "Total Due",
  });

  const [saved, setSaved] = useState(false);

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("translateSettings");

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.log("Unable to load translate settings");
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  // Save settings
  const handleSave = () => {
    localStorage.setItem(
      "translateSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const inputClass = `
    w-full
    rounded
    border
    border-gray-300
    bg-white
    px-3
    py-2
    text-sm
    text-gray-700
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
  `;

  const fields = [
    {
      label: "Quote Label",
      name: "quoteLabel",
      help: "You can change this from Quote to Estimate or Proposal (or any other word you like).",
    },
    {
      label: "Quote Label Plural",
      name: "quoteLabelPlural",
      help: "The plural of the above.",
    },
    {
      label: "Invoice Label",
      name: "invoiceLabel",
      help: "You can change this from Invoice to Tax Invoice (or any other word you like).",
    },
    {
      label: "Invoice Label Plural",
      name: "invoiceLabelPlural",
      help: "The plural of the above.",
    },
    {
      label: "Hrs/Qty",
      name: "hrsQty",
      help: "",
    },
    {
      label: "Service",
      name: "service",
      help: "",
    },
    {
      label: "Rate/Price",
      name: "ratePrice",
      help: "",
    },
    {
      label: "Adjust",
      name: "adjust",
      help: "",
    },
    {
      label: "Sub Total",
      name: "subTotal",
      help: "",
    },
    {
      label: "Discount",
      name: "discount",
      help: "",
    },
    {
      label: "Total",
      name: "total",
      help: "",
    },
    {
      label: "Total Due",
      name: "totalDue",
      help: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= MAIN CONTAINER ================= */}

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-3
          py-5

          sm:px-5
          sm:py-6

          md:px-6

          lg:px-8
          lg:py-8

          xl:px-10
        "
      >

        {/* ================= TITLE ================= */}

        <div className="mb-5 sm:mb-6">

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800

              sm:text-3xl
            "
          >
            Translate Settings
          </h1>

        </div>


        {/* ================= INFORMATION BOX ================= */}

        <div
          className="
            mb-6
            rounded-md
            border
            border-gray-200
            bg-gray-50
            p-3

            sm:p-4
          "
        >

          <div className="flex items-start gap-3">

            {/* Info Icon */}

            <div
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gray-200
                text-xs
                font-bold
                text-gray-600
              "
            >
              i
            </div>


            {/* Information */}

            <div>

              <p className="text-sm text-gray-600">
                Here you can translate strings into your own
                language, or simply change the text to suit
                your needs.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Change the labels displayed on your quotes
                and invoices.
              </p>

            </div>

          </div>

        </div>


        {/* ================= SETTINGS CARD ================= */}

        <section
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          {/* Card Header */}

          <div
            className="
              border-b
              border-gray-200
              px-4
              py-4

              sm:px-6
            "
          >

            <h2
              className="
                text-lg
                font-bold
                text-gray-800
              "
            >
              Translate Settings
            </h2>

          </div>


          {/* ================= FORM ================= */}

          <div
            className="
              space-y-5
              p-4

              sm:p-6
            "
          >

            {fields.map((field) => (
              <div
                key={field.name}
                className="
                  grid
                  gap-2

                  md:grid-cols-[180px_1fr]
                  md:items-start
                "
              >

                {/* Label */}

                <label
                  htmlFor={field.name}
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  {field.label}
                </label>


                {/* Input + Help */}

                <div>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={settings[field.name]}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  {field.help && (
                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-gray-400
                      "
                    >
                      {field.help}
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>

        </section>


        {/* ================= SAVE ================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-center
          "
        >

          <button
            type="button"
            onClick={handleSave}
            className="
              w-full
              rounded-md
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-300

              sm:w-auto
            "
          >
            Save
          </button>


          {saved && (
            <span
              className="
                text-sm
                font-medium
                text-green-600
              "
            >
              ✓ Translation settings saved successfully.
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default TranslateSettings;