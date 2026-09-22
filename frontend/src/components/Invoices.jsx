import { useEffect, useState } from "react";


const API = "http://127.0.0.1:8000/api";

function Invoices() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    client: "",
    invoice_number: "",
    title: "",
    description: "",
    due_date: "",
    status: "draft",
    discount: 0,
    tax: 0,
    notes: "",
  });

  const [items, setItems] = useState([
    {
      item_title: "",
      description: "",
      quantity: 1,
      rate: 0,
      taxable: false,
    },
  ]);

  // ================================
  // LOAD CLIENTS AND INVOICES
  // ================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [clientsResponse, invoicesResponse] =
        await Promise.all([
          fetch(`${API}/clients/`),
          fetch(`${API}/invoices/`),
        ]);

      if (!clientsResponse.ok || !invoicesResponse.ok) {
        throw new Error("Unable to load data");
      }

      const clientsData = await clientsResponse.json();
      const invoicesData = await invoicesResponse.json();

      setClients(clientsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error(error);
      alert("Unable to load clients or invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // FORM CHANGE
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // ITEM CHANGE
  // ================================

  const handleItemChange = (index, field, value) => {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "rate"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  // ================================
  // ADD ITEM
  // ================================

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      {
        item_title: "",
        description: "",
        quantity: 1,
        rate: 0,
        taxable: false,
      },
    ]);
  };

  // ================================
  // REMOVE ITEM
  // ================================

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((previous) =>
      previous.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  // ================================
  // CALCULATIONS
  // ================================

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0) *
        Number(item.rate || 0),
    0
  );

  const discountAmount =
    (subtotal * Number(form.discount || 0)) / 100;

  const afterDiscount =
    subtotal - discountAmount;

  const taxAmount =
    (afterDiscount * Number(form.tax || 0)) / 100;

  const total =
    afterDiscount + taxAmount;

  // ================================
  // CREATE INVOICE
  // ================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.client) {
      alert("Please select a client.");
      return;
    }

    if (!form.invoice_number.trim()) {
      alert("Please enter invoice number.");
      return;
    }

    if (items.some((item) => !item.item_title.trim())) {
      alert("Please enter an item title for all items.");
      return;
    }

    try {
      setSaving(true);

      // Create invoice
      const invoiceResponse = await fetch(
        `${API}/invoices/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: Number(form.client),
            invoice_number: form.invoice_number,
            title: form.title,
            description: form.description,
            due_date: form.due_date || null,
            status: form.status,

            // Backend stores the actual amount
            discount: discountAmount,
            tax: taxAmount,

            notes: form.notes,
          }),
        }
      );

      if (!invoiceResponse.ok) {
        const errorData =
          await invoiceResponse.json();

        console.error(errorData);

        throw new Error(
          "Invoice creation failed."
        );
      }

      const invoice =
        await invoiceResponse.json();

      // Create invoice items
      for (const item of items) {
        const itemResponse = await fetch(
          `${API}/invoice-items/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoice: invoice.id,
              item_title: item.item_title,
              description: item.description,
              quantity: Number(item.quantity),
              rate: Number(item.rate),
              taxable: item.taxable,
            }),
          }
        );

        if (!itemResponse.ok) {
          console.error(
            await itemResponse.json()
          );
        }
      }

      alert("Invoice created successfully.");

      // Reset form
      setForm({
        client: "",
        invoice_number: "",
        title: "",
        description: "",
        due_date: "",
        status: "draft",
        discount: 0,
        tax: 0,
        notes: "",
      });

      setItems([
        {
          item_title: "",
          description: "",
          quantity: 1,
          rate: 0,
          taxable: false,
        },
      ]);

      loadData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating invoice.");
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // DELETE INVOICE
  // ================================

  const deleteInvoice = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/invoices/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setInvoices((previous) =>
        previous.filter(
          (invoice) => invoice.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete invoice.");
    }
  };

  // ================================
  // DOWNLOAD PDF
  // ================================

  const downloadPDF = (invoice) => {
    const client = clients.find(
      (item) => item.id === invoice.client
    );

    const pdfInvoice = {
      ...invoice,

      client_name:
        client?.name || "Client",

      client_email:
        client?.email || "",

      client_address:
        client?.address || "",

      items:
        invoice.items || [],
    };

    generateInvoicePDF(pdfInvoice, {
      businessName:
        "Ultrakey IT Solutions Private Limited",

      address:
        "Hyderabad, Telangana, India",

      website:
        "www.ultrakeyit.com",
    });
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <p className="text-gray-500">
          Loading invoices...
        </p>
      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-8">

      <div className="mx-auto w-full max-w-7xl">

        {/* ============================
            PAGE TITLE
        ============================ */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage your invoices.
          </p>

        </div>


        {/* ============================
            CREATE INVOICE
        ============================ */}

        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Add New Invoice
            </h2>

          </div>


          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6"
          >

            {/* BASIC DETAILS */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Client */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Client
                </label>

                <select
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Client
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Invoice Number */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoice_number"
                  value={form.invoice_number}
                  onChange={handleChange}
                  placeholder="INV-001"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Title */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Invoice title"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Due Date */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Due Date
                </label>

                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Status */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="sent">
                    Sent
                  </option>

                  <option value="paid">
                    Paid
                  </option>

                  <option value="overdue">
                    Overdue
                  </option>
                </select>
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Invoice description..."
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* ============================
                LINE ITEMS
            ============================ */}

            <div className="mt-8">

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h3 className="text-lg font-bold text-gray-800">
                  Line Items
                </h3>

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 sm:w-auto"
                >
                  + Add Item
                </button>

              </div>


              <div className="space-y-4">

                {items.map((item, index) => (

                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                      {/* Item */}

                      <div className="sm:col-span-2 lg:col-span-2">

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Item Title
                        </label>

                        <input
                          type="text"
                          value={item.item_title}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "item_title",
                              e.target.value
                            )
                          }
                          placeholder="Service / Product"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                      </div>


                      {/* Quantity */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                      </div>


                      {/* Rate */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Rate
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                      </div>

                    </div>


                    {/* Description + Taxable */}

                    <div className="mt-4 grid gap-4 md:grid-cols-2">

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Description
                        </label>

                        <textarea
                          rows="2"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Item description..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                      </div>


                      <div className="flex items-center justify-between">

                        <label className="flex items-center gap-2 text-sm text-gray-700">

                          <input
                            type="checkbox"
                            checked={item.taxable}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "taxable",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />

                          Taxable

                        </label>


                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        )}

                      </div>

                    </div>


                    {/* Amount */}

                    <div className="mt-3 text-right text-sm font-semibold text-gray-700">

                      Amount: ₹
                      {(
                        Number(item.quantity || 0) *
                        Number(item.rate || 0)
                      ).toFixed(2)}

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* ============================
                DISCOUNT / TAX
            ============================ */}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tax (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="tax"
                  value={form.tax}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>

            </div>


            {/* ============================
                NOTES
            ============================ */}

            <div className="mt-5">

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Payment terms, notes..."
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* ============================
                SUMMARY
            ============================ */}

            <div className="mt-8 flex justify-end">

              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 sm:max-w-sm">

                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Discount
                  </span>

                  <span>
                    - ₹{discountAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Tax
                  </span>

                  <span>
                    ₹{taxAmount.toFixed(2)}
                  </span>
                </div>

                <div className="my-3 border-t border-gray-300" />

                <div className="flex justify-between text-lg font-bold text-gray-800">

                  <span>Total</span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>

                </div>

              </div>

            </div>


            {/* ============================
                SAVE
            ============================ */}

            <div className="mt-6">

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving
                  ? "Saving..."
                  : "Create Invoice"}
              </button>

            </div>

          </form>

        </div>


        {/* ============================
            INVOICE LIST
        ============================ */}

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">

            <h2 className="text-lg font-bold text-gray-800">
              Invoice List
            </h2>

          </div>


          {invoices.length === 0 ? (

            <div className="p-8 text-center text-sm text-gray-500">
              No invoices found.
            </div>

          ) : (

            <div className="divide-y divide-gray-200">

              {invoices.map((invoice) => {

                const client = clients.find(
                  (item) =>
                    item.id === invoice.client
                );

                const invoiceItems =
                  invoice.items || [];

                return (
                  <div
                    key={invoice.id}
                    className="p-4 sm:p-6"
                  >

                    {/* Invoice Header */}

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <h3 className="text-lg font-bold text-gray-800">
                          {invoice.invoice_number}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {client?.name || "Client"}
                        </p>

                        {invoice.title && (
                          <p className="mt-1 text-sm text-gray-600">
                            {invoice.title}
                          </p>
                        )}

                      </div>


                      {/* STATUS */}

                      <div>

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : invoice.status === "overdue"
                                ? "bg-red-100 text-red-700"
                                : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {invoice.status}
                        </span>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          Created
                        </p>

                        <p className="font-medium text-gray-700">
                          {invoice.created_date || "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Due Date
                        </p>

                        <p className="font-medium text-gray-700">
                          {invoice.due_date || "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Discount
                        </p>

                        <p className="font-medium text-gray-700">
                          ₹
                          {Number(
                            invoice.discount || 0
                          ).toFixed(2)}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Tax
                        </p>

                        <p className="font-medium text-gray-700">
                          ₹
                          {Number(
                            invoice.tax || 0
                          ).toFixed(2)}
                        </p>
                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                      {/* DOWNLOAD PDF */}

                      <button
                        type="button"
                        onClick={() =>
                          downloadPDF(invoice)
                        }
                        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                      >
                        Download PDF
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          deleteInvoice(invoice.id)
                        }
                        className="w-full rounded-md bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
                      >
                        Delete
                      </button>

                    </div>


                    {/* ITEMS */}

                    {invoiceItems.length > 0 && (
                      <div className="mt-5 overflow-x-auto">

                        <table className="min-w-full text-left text-sm">

                          <thead>

                            <tr className="border-b border-gray-200 text-xs uppercase text-gray-400">

                              <th className="px-3 py-2">
                                Item
                              </th>

                              <th className="px-3 py-2">
                                Qty
                              </th>

                              <th className="px-3 py-2">
                                Rate
                              </th>

                              <th className="px-3 py-2 text-right">
                                Amount
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {invoiceItems.map(
                              (item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-gray-100"
                                >

                                  <td className="px-3 py-2">
                                    {item.item_title}
                                  </td>

                                  <td className="px-3 py-2">
                                    {item.quantity}
                                  </td>

                                  <td className="px-3 py-2">
                                    ₹
                                    {Number(
                                      item.rate || 0
                                    ).toFixed(2)}
                                  </td>

                                  <td className="px-3 py-2 text-right font-medium">
                                    ₹
                                    {Number(
                                      item.amount || 0
                                    ).toFixed(2)}
                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Invoices;