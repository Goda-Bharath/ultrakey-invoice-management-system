import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

function Quotes() {
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    quote_number: "",
    title: "",
    description: "",
    valid_until: "",
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [clientsResponse, quotesResponse] = await Promise.all([
        fetch(`${API_BASE}/clients/`),
        fetch(`${API_BASE}/quotes/`),
      ]);

      if (!clientsResponse.ok || !quotesResponse.ok) {
        throw new Error("Failed to load data");
      }

      const clientsData = await clientsResponse.json();
      const quotesData = await quotesResponse.json();

      setClients(Array.isArray(clientsData) ? clientsData : []);
      setQuotes(Array.isArray(quotesData) ? quotesData : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load quotes. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item_title: "",
        description: "",
        quantity: 1,
        rate: 0,
        taxable: false,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems(items.filter((_, i) => i !== index));
  };

  const getItemAmount = (item) => {
    return Number(item.quantity || 0) * Number(item.rate || 0);
  };

  const subtotal = items.reduce(
    (total, item) => total + getItemAmount(item),
    0
  );

  const discountAmount = Number(formData.discount || 0);

  const afterDiscount = Math.max(subtotal - discountAmount, 0);

  const taxAmount =
    (afterDiscount * Number(formData.tax || 0)) / 100;

  const total = afterDiscount + taxAmount;

  const resetForm = () => {
    setFormData({
      client: "",
      quote_number: "",
      title: "",
      description: "",
      valid_until: "",
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
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      setError("Please select a client.");
      return;
    }

    if (!formData.quote_number.trim()) {
      setError("Please enter a quote number.");
      return;
    }

    const validItems = items.filter(
      (item) => item.item_title.trim() !== ""
    );

    if (validItems.length === 0) {
      setError("Please add at least one line item.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const quoteResponse = await fetch(`${API_BASE}/quotes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: Number(formData.client),
          quote_number: formData.quote_number,
          title: formData.title,
          description: formData.description,
          valid_until: formData.valid_until || null,
          status: formData.status,
          discount: discountAmount,
          tax: taxAmount,
          notes: formData.notes,
        }),
      });

      if (!quoteResponse.ok) {
        const errorData = await quoteResponse.json();
        console.error("Quote error:", errorData);
        throw new Error("Failed to create quote");
      }

      const createdQuote = await quoteResponse.json();

      for (const item of validItems) {
        const itemResponse = await fetch(`${API_BASE}/quote-items/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quote: createdQuote.id,
            item_title: item.item_title,
            description: item.description,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            taxable: item.taxable,
          }),
        });

        if (!itemResponse.ok) {
          console.error(
            "Failed to create quote item:",
            await itemResponse.json()
          );
        }
      }

      alert("Quote created successfully!");

      resetForm();
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Unable to save quote. Please check the backend.");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quote?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/quotes/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quote");
      }

      setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    } catch (err) {
      console.error(err);
      setError("Unable to delete quote.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading quotes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Quotes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage quotations
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          {showForm ? "Close Form" : "+ Add New Quote"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add Quote Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-xl bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Add New Quote
          </h2>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Client *
              </label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              >
                <option value="">Select Client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quote Number *
              </label>

              <input
                type="text"
                name="quote_number"
                value={formData.quote_number}
                onChange={handleChange}
                placeholder="QT-001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Website Development"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Valid Until
              </label>

              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>

          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Quote description..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            />
          </div>

          {/* Items */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Line Items
              </h3>

              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
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
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Item
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
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>

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
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>

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
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Amount
                      </label>

                      <div className="flex gap-2">
                        <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
                          ₹{getItemAmount(item).toFixed(2)}
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="rounded-lg px-3 text-red-600 hover:bg-red-50"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Item description"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                    />
                  </div>

                  <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
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
                    />
                    Taxable
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Discount / Tax / Total */}
          <div className="mt-7 ml-auto max-w-md rounded-xl bg-gray-50 p-5">

            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-gray-600">
                Discount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-right"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-gray-600">
                Tax (%)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-right"
              />
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes / Terms & Conditions
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Terms and conditions..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
                setError("");
              }}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Quote"}
            </button>

          </div>
        </form>
      )}

      {/* Quote List */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            All Quotes
          </h2>
        </div>

        {quotes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No quotes found.
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Quote No.</th>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Valid Until</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {quotes.map((quote) => {
                    const client = clients.find(
                      (c) => c.id === quote.client
                    );

                    return (
                      <tr
                        key={quote.id}
                        className="border-t border-gray-100"
                      >
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {quote.quote_number}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {client?.name || "Unknown"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {quote.created_date || "-"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {quote.valid_until || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                            {quote.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => deleteQuote(quote.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="space-y-3 p-4 md:hidden">
              {quotes.map((quote) => {
                const client = clients.find(
                  (c) => c.id === quote.client
                );

                return (
                  <div
                    key={quote.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {quote.quote_number}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {client?.name || "Unknown"}
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs capitalize text-gray-700">
                        {quote.status}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      <p>
                        Created: {quote.created_date || "-"}
                      </p>

                      <p>
                        Valid until: {quote.valid_until || "-"}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="mt-3 text-sm font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default Quotes;

