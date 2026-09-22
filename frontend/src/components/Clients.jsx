import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/clients/";

function Clients() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ==========================================
  // LOAD CLIENTS
  // ==========================================
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load clients");
      }

      const data = await response.json();

      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading clients:", error);
      setError("Unable to load clients. Please check the Django server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN FORM
  // ==========================================
  const openForm = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  // ==========================================
  // SAVE CLIENT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        console.error("Server error:", errorData);

        throw new Error("Failed to create client");
      }

      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      await fetchClients();

      setSuccess("Client added successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error creating client:", error);

      setError("Unable to save client. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CLIENT
  // ==========================================
  const deleteClient = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      setShowMenu(null);

      await fetchClients();

      setSuccess("Client deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting client:", error);

      setError("Unable to delete client.");
    }
  };

  // ==========================================
  // FILTER CLIENTS
  // ==========================================
  const filteredClients = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      return (
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query) ||
        client.address?.toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  // ==========================================
  // INITIALS
  // ==========================================
  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0]?.charAt(0)?.toUpperCase() || "?";
    }

    return (
      words[0]?.charAt(0)?.toUpperCase() +
      words[words.length - 1]?.charAt(0)?.toUpperCase()
    );
  };

  // ==========================================
  // AVATAR STYLE
  // ==========================================
  const getAvatarStyle = (name = "") => {
    const styles = [
      "bg-blue-100 text-blue-700",
      "bg-violet-100 text-violet-700",
      "bg-emerald-100 text-emerald-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
      "bg-cyan-100 text-cyan-700",
    ];

    let total = 0;

    for (let i = 0; i < name.length; i++) {
      total += name.charCodeAt(i);
    }

    return styles[total % styles.length];
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-slate-600">Clients</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Clients
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your customers and billing contacts.
              </p>
            </div>

            <button
              onClick={openForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
            >
              <span className="text-lg leading-none">+</span>
              Add client
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
              ✓
            </span>

            {success}

          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              !
            </span>

            {error}

          </div>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total clients
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {clients.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👥
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              All registered clients
            </p>

          </div>

          {/* Email */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Email contacts
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {clients.filter((c) => c.email).length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                ✉
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Clients with email
            </p>

          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Phone contacts
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {clients.filter((c) => c.phone).length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ☎
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Clients with phone
            </p>

          </div>

          {/* Addresses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Addresses
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {clients.filter((c) => c.address).length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                📍
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Clients with address
            </p>

          </div>

        </div>

        {/* =====================================================
            CLIENT TABLE CARD
        ===================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                All clients
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredClients.length} of {clients.length} clients
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">

              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}
          {loading ? (

            <div className="space-y-4 p-5">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-11 w-11 rounded-full bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
                  </div>

                  <div className="hidden h-4 w-24 rounded bg-slate-100 sm:block" />
                </div>
              ))}

            </div>

          ) : filteredClients.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */
            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                {search ? "⌕" : "👥"}
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {search
                  ? "No matching clients"
                  : "No clients yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search
                  ? "Try searching with a different name, email, phone number or address."
                  : "Add your first client to start creating invoices and quotations."}
              </p>

              {!search && (
                <button
                  onClick={openForm}
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Add your first client
                </button>
              )}

            </div>

          ) : (

            <>
              {/* =============================================
                  DESKTOP TABLE
              ============================================= */}
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Client
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Phone
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Address
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredClients.map((client) => (

                      <tr
                        key={client.id}
                        className="group transition hover:bg-slate-50/70"
                      >

                        {/* Client */}
                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${getAvatarStyle(
                                client.name
                              )}`}
                            >
                              {getInitials(client.name)}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-slate-800">
                                {client.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Client #{String(client.id).padStart(4, "0")}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">

                          {client.email ? (
                            <span className="text-sm text-slate-600">
                              {client.email}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-300">
                              Not provided
                            </span>
                          )}

                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">

                          {client.phone ? (
                            <span className="text-sm text-slate-600">
                              {client.phone}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-300">
                              Not provided
                            </span>
                          )}

                        </td>

                        {/* Address */}
                        <td className="max-w-xs px-6 py-4">

                          {client.address ? (
                            <p
                              className="truncate text-sm text-slate-600"
                              title={client.address}
                            >
                              {client.address}
                            </p>
                          ) : (
                            <span className="text-sm text-slate-300">
                              Not provided
                            </span>
                          )}

                        </td>

                        {/* Action */}
                        <td className="relative px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              setShowMenu(
                                showMenu === client.id
                                  ? null
                                  : client.id
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            ⋮
                          </button>

                          {showMenu === client.id && (
                            <div className="absolute right-6 top-14 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl">

                              <button
                                onClick={() => deleteClient(client.id)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete client
                              </button>

                            </div>
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* =============================================
                  MOBILE CARDS
              ============================================= */}
              <div className="divide-y divide-slate-100 md:hidden">

                {filteredClients.map((client) => (

                  <div
                    key={client.id}
                    className="p-4 transition hover:bg-slate-50"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${getAvatarStyle(
                            client.name
                          )}`}
                        >
                          {getInitials(client.name)}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-semibold text-slate-800">
                            {client.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Client #{String(client.id).padStart(4, "0")}
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() => deleteClient(client.id)}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                    <div className="mt-4 space-y-2.5 rounded-xl bg-slate-50 p-3">

                      {client.email && (
                        <div className="flex gap-3 text-sm">
                          <span className="w-16 shrink-0 text-slate-400">
                            Email
                          </span>

                          <span className="break-all text-slate-700">
                            {client.email}
                          </span>
                        </div>
                      )}

                      {client.phone && (
                        <div className="flex gap-3 text-sm">
                          <span className="w-16 shrink-0 text-slate-400">
                            Phone
                          </span>

                          <span className="text-slate-700">
                            {client.phone}
                          </span>
                        </div>
                      )}

                      {client.address && (
                        <div className="flex gap-3 text-sm">
                          <span className="w-16 shrink-0 text-slate-400">
                            Address
                          </span>

                          <span className="text-slate-700">
                            {client.address}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>

                ))}

              </div>
            </>
          )}

        </section>

      </main>

      {/* =====================================================
          ADD CLIENT MODAL
      ===================================================== */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Add new client
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add customer details for invoices and quotations.
                </p>

              </div>

              <button
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto p-5 sm:p-6"
            >

              <div className="space-y-5">

                {/* Name */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Client name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoFocus
                    placeholder="e.g. Acme Technologies"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                </div>

                {/* Email / Phone */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@company.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />

                  </div>

                </div>

                {/* Address */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter complete client address"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                </div>

              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Creating client..." : "Create client"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Clients;