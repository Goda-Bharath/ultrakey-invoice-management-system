import { useEffect, useState } from "react";

function EmailSettings() {
  const [settings, setSettings] = useState({
    emailAddress: "support@bharath.com",
    emailName: "Ultrakey IT Solutions Private Limited",
    bccClientEmails: true,

    quoteSubject: "New quote %number% available",

    quoteContent:
      "Hi %client_first_name%,\n\nYou have a new quote available (%number%) which can be viewed at %link%.",

    quoteButtonText: "View this quote online",

    invoiceSubject: "New invoice %number% available",

    invoiceContent:
      "Hi %client_first_name%,\n\nYou have a new invoice available (%number%) which can be viewed at %link%.",

    invoiceButtonText: "View this invoice online",

    paymentSubject: "Payment received for invoice %number%",

    paymentContent:
      "Hi %client_first_name%,\n\nWe have received your payment for invoice %number%.",

    paymentButtonText: "View this invoice online",

    reminderSubject: "Payment reminder for invoice %number%",

    reminderContent:
      "Hi %client_first_name%,\n\nThis is a reminder that invoice %number% is due.",

    reminderButtonText: "View this invoice online",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("emailSettings");

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.log("Unable to load email settings");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "emailSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const inputClass =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const textareaClass =
    "min-h-[140px] w-full resize-y rounded border border-gray-300 bg-white px-3 py-2 text-sm leading-6 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= PAGE CONTAINER ================= */}

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
        "
      >

        {/* ================= PAGE TITLE ================= */}

        <div className="mb-5 sm:mb-6">

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800

              sm:text-3xl
            "
          >
            Email Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure email notifications and email templates.
          </p>

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

            <div>

              <p className="text-sm text-gray-600">
                Here you will find all of the Email-related
                settings.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Configure the email address, sender name,
                notification messages and email templates.
              </p>

            </div>

          </div>

        </div>


        {/* ================= BASIC EMAIL SETTINGS ================= */}

        <section
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Email Settings
            </h2>

          </div>


          <div className="space-y-5 p-4 sm:p-6">

            {/* Email Address */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-center
              "
            >

              <label
                htmlFor="emailAddress"
                className={labelClass}
              >
                Email Address
              </label>

              <div>

                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  value={settings.emailAddress}
                  onChange={handleChange}
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-400">
                  The email address to send and receive
                  notifications.
                </p>

              </div>

            </div>


            {/* Email Name */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-center
              "
            >

              <label
                htmlFor="emailName"
                className={labelClass}
              >
                Email Name
              </label>

              <div>

                <input
                  id="emailName"
                  name="emailName"
                  type="text"
                  value={settings.emailName}
                  onChange={handleChange}
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-400">
                  The name on emails sent from your business.
                </p>

              </div>

            </div>


            {/* BCC */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-center
              "
            >

              <label className={labelClass}>
                Bcc on Client Emails
              </label>

              <label
                className="
                  flex
                  cursor-pointer
                  items-start
                  gap-2
                  text-sm
                  text-gray-600
                "
              >

                <input
                  type="checkbox"
                  name="bccClientEmails"
                  checked={settings.bccClientEmails}
                  onChange={handleChange}
                  className="
                    mt-0.5
                    h-4
                    w-4
                    accent-blue-600
                  "
                />

                <span>
                  Yes, send myself a copy of all client emails
                  (Bcc). Recommended.
                </span>

              </label>

            </div>

          </div>

        </section>


        {/* ================= QUOTE AVAILABLE ================= */}

        <section
          className="
            mt-6
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Quote Available
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Sent to the client automatically when the email
              option is enabled.
            </p>

          </div>


          <div className="space-y-5 p-4 sm:p-6">

            {/* Subject */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-start
              "
            >

              <label
                htmlFor="quoteSubject"
                className={labelClass}
              >
                Subject
              </label>

              <div>

                <input
                  id="quoteSubject"
                  name="quoteSubject"
                  type="text"
                  value={settings.quoteSubject}
                  onChange={handleChange}
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-400">
                  The subject of the email. Wildcards are
                  allowed.
                </p>

              </div>

            </div>


            {/* Content */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-start
              "
            >

              <label
                htmlFor="quoteContent"
                className={labelClass}
              >
                Content
              </label>

              <div>

                {/* Simple toolbar */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-1
                    rounded-t
                    border
                    border-b-0
                    border-gray-300
                    bg-gray-50
                    p-2
                  "
                >

                  <button
                    type="button"
                    className="rounded px-2 py-1 font-bold hover:bg-gray-200"
                  >
                    B
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 italic hover:bg-gray-200"
                  >
                    I
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 underline hover:bg-gray-200"
                  >
                    U
                  </button>

                  <span className="mx-1 h-5 w-px bg-gray-300" />

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-sm hover:bg-gray-200"
                  >
                    ≡
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-sm hover:bg-gray-200"
                  >
                    ☷
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-sm hover:bg-gray-200"
                  >
                    ↔
                  </button>

                </div>

                <textarea
                  id="quoteContent"
                  name="quoteContent"
                  value={settings.quoteContent}
                  onChange={handleChange}
                  className={`${textareaClass} rounded-t-none`}
                />

                <p className="mt-1 text-xs text-gray-400">
                  The content of the email. Wildcards and HTML
                  are allowed.
                </p>

              </div>

            </div>


            {/* Button Text */}

            <div
              className="
                grid
                gap-2

                md:grid-cols-[180px_1fr]
                md:items-start
              "
            >

              <label
                htmlFor="quoteButtonText"
                className={labelClass}
              >
                Button text
              </label>

              <div>

                <input
                  id="quoteButtonText"
                  name="quoteButtonText"
                  type="text"
                  value={settings.quoteButtonText}
                  onChange={handleChange}
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-400">
                  The "View this quote online" button text.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================= INVOICE AVAILABLE ================= */}

        <section
          className="
            mt-6
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Invoice Available
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Email template used when an invoice becomes
              available.
            </p>

          </div>


          <div className="space-y-5 p-4 sm:p-6">

            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="invoiceSubject"
                className={labelClass}
              >
                Subject
              </label>

              <input
                id="invoiceSubject"
                name="invoiceSubject"
                type="text"
                value={settings.invoiceSubject}
                onChange={handleChange}
                className={inputClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="invoiceContent"
                className={labelClass}
              >
                Content
              </label>

              <textarea
                id="invoiceContent"
                name="invoiceContent"
                value={settings.invoiceContent}
                onChange={handleChange}
                className={textareaClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="invoiceButtonText"
                className={labelClass}
              >
                Button text
              </label>

              <input
                id="invoiceButtonText"
                name="invoiceButtonText"
                type="text"
                value={settings.invoiceButtonText}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

          </div>

        </section>


        {/* ================= PAYMENT RECEIVED ================= */}

        <section
          className="
            mt-6
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Payment Received
            </h2>

          </div>


          <div className="space-y-5 p-4 sm:p-6">

            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="paymentSubject"
                className={labelClass}
              >
                Subject
              </label>

              <input
                id="paymentSubject"
                name="paymentSubject"
                type="text"
                value={settings.paymentSubject}
                onChange={handleChange}
                className={inputClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="paymentContent"
                className={labelClass}
              >
                Content
              </label>

              <textarea
                id="paymentContent"
                name="paymentContent"
                value={settings.paymentContent}
                onChange={handleChange}
                className={textareaClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="paymentButtonText"
                className={labelClass}
              >
                Button text
              </label>

              <input
                id="paymentButtonText"
                name="paymentButtonText"
                type="text"
                value={settings.paymentButtonText}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

          </div>

        </section>


        {/* ================= PAYMENT REMINDER ================= */}

        <section
          className="
            mt-6
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Payment Reminder
            </h2>

          </div>


          <div className="space-y-5 p-4 sm:p-6">

            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="reminderSubject"
                className={labelClass}
              >
                Subject
              </label>

              <input
                id="reminderSubject"
                name="reminderSubject"
                type="text"
                value={settings.reminderSubject}
                onChange={handleChange}
                className={inputClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="reminderContent"
                className={labelClass}
              >
                Content
              </label>

              <textarea
                id="reminderContent"
                name="reminderContent"
                value={settings.reminderContent}
                onChange={handleChange}
                className={textareaClass}
              />

            </div>


            <div
              className="
                grid
                gap-2
                md:grid-cols-[180px_1fr]
              "
            >

              <label
                htmlFor="reminderButtonText"
                className={labelClass}
              >
                Button text
              </label>

              <input
                id="reminderButtonText"
                name="reminderButtonText"
                type="text"
                value={settings.reminderButtonText}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

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
            Save Settings
          </button>

          {saved && (
            <span className="text-sm font-medium text-green-600">
              ✓ Email settings saved successfully.
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default EmailSettings;