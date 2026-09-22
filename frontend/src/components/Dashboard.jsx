import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          clientsResponse,
          invoicesResponse,
          quotesResponse,
        ] = await Promise.all([
          fetch(`${API_BASE}/clients/`),
          fetch(`${API_BASE}/invoices/`),
          fetch(`${API_BASE}/quotes/`),
        ]);

        if (
          !clientsResponse.ok ||
          !invoicesResponse.ok ||
          !quotesResponse.ok
        ) {
          throw new Error("Failed to load dashboard data");
        }

        const clientsData = await clientsResponse.json();
        const invoicesData = await invoicesResponse.json();
        const quotesData = await quotesResponse.json();

        setClients(Array.isArray(clientsData) ? clientsData : []);
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        setQuotes(Array.isArray(quotesData) ? quotesData : []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const paidInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "paid"),
    [invoices]
  );

  const pendingInvoices = useMemo(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.status === "draft" ||
          invoice.status === "sent"
      ),
    [invoices]
  );

  const overdueInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "overdue"),
    [invoices]
  );

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort(
        (a, b) =>
          new Date(b.created_date || 0) -
          new Date(a.created_date || 0)
      )
      .slice(0, 6);
  }, [invoices]);

  // =====================================================
  // CLIENT NAME
  // =====================================================

  const getClientName = (clientId) => {
    const client = clients.find(
      (item) => item.id === clientId
    );

    return client ? client.name : "Unknown Client";
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (!name) return "?";

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "overdue":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    if (!status) return "Draft";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f9]">

        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

            <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />

          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                <div className="mt-4 h-9 w-16 animate-pulse rounded bg-slate-100" />

                <div className="mt-5 h-3 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            ))}

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 space-y-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-48 rounded bg-slate-100" />
                  </div>

                  <div className="h-6 w-16 rounded-full bg-slate-100" />
                </div>
              ))}

            </div>

          </div>

        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f6f7f9]">

      {/* =================================================
          HEADER
      ================================================= */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-slate-600">
                  Dashboard
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Overview of your quotation and invoice system.
              </p>

            </div>

            {/* Live indicator */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              System active

            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Invoices */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total invoices
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {invoices.length}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🧾
              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-xs">

              <span className="font-medium text-blue-600">
                {pendingInvoices.length}
              </span>

              <span className="text-slate-400">
                pending invoices
              </span>

            </div>

          </div>

          {/* Quotes */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total quotes
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {quotes.length}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                📄
              </div>

            </div>

            <div className="mt-5 text-xs text-slate-400">
              Quotation documents
            </div>

          </div>

          {/* Clients */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total clients
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {clients.length}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                👥
              </div>

            </div>

            <div className="mt-5 text-xs text-slate-400">
              Registered customers
            </div>

          </div>

          {/* Paid */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Paid invoices
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {paidInvoices.length}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ✓
              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-xs">

              <span className="font-medium text-emerald-600">
                {overdueInvoices.length}
              </span>

              <span className="text-slate-400">
                overdue
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            SECOND ROW
        ================================================= */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* Recent invoices */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Recent invoices
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest invoices created in the system
                </p>

              </div>

              <div className="text-xs font-medium text-slate-400">
                {recentInvoices.length} recent
              </div>

            </div>

            {recentInvoices.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                  🧾
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No invoices yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Create your first invoice and it will appear here.
                </p>

              </div>

            ) : (

              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full text-left">

                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Invoice
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Client
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Created
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Due date
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {recentInvoices.map((invoice) => {

                        const clientName = getClientName(
                          invoice.client
                        );

                        return (
                          <tr
                            key={invoice.id}
                            className="transition hover:bg-slate-50/70"
                          >

                            {/* Invoice */}
                            <td className="px-6 py-4">

                              <p className="font-semibold text-slate-800">
                                {invoice.invoice_number}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Invoice #{invoice.id}
                              </p>

                            </td>

                            {/* Client */}
                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                                  {getInitials(clientName)}
                                </div>

                                <span className="text-sm text-slate-700">
                                  {clientName}
                                </span>

                              </div>

                            </td>

                            {/* Created */}
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {invoice.created_date || "-"}
                            </td>

                            {/* Due */}
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {invoice.due_date || "-"}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 text-right">

                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                  invoice.status
                                )}`}
                              >
                                {getStatusText(invoice.status)}
                              </span>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

                {/* Mobile */}
                <div className="divide-y divide-slate-100 md:hidden">

                  {recentInvoices.map((invoice) => {

                    const clientName = getClientName(
                      invoice.client
                    );

                    return (
                      <div
                        key={invoice.id}
                        className="p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
                              {getInitials(clientName)}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-slate-800">
                                {invoice.invoice_number}
                              </p>

                              <p className="mt-0.5 truncate text-sm text-slate-500">
                                {clientName}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                              invoice.status
                            )}`}
                          >
                            {getStatusText(invoice.status)}
                          </span>

                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3">

                          <div>
                            <p className="text-xs text-slate-400">
                              Created
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {invoice.created_date || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Due date
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {invoice.due_date || "-"}
                            </p>
                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              </>
            )}

          </section>

          {/* =================================================
              ACTIVITY / QUICK OVERVIEW
          ================================================= */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-5">

              <h2 className="font-semibold text-slate-900">
                Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current invoice status
              </p>

            </div>

            <div className="space-y-5 p-5">

              {/* Paid */}
              <div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-sm text-emerald-600">
                      ✓
                    </span>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Paid
                      </p>

                      <p className="text-xs text-slate-400">
                        Completed invoices
                      </p>
                    </div>

                  </div>

                  <span className="text-lg font-semibold text-slate-800">
                    {paidInvoices.length}
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width:
                        invoices.length > 0
                          ? `${(paidInvoices.length /
                              invoices.length) *
                              100}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Pending */}
              <div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">
                      ○
                    </span>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Pending
                      </p>

                      <p className="text-xs text-slate-400">
                        Draft or sent invoices
                      </p>
                    </div>

                  </div>

                  <span className="text-lg font-semibold text-slate-800">
                    {pendingInvoices.length}
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width:
                        invoices.length > 0
                          ? `${(pendingInvoices.length /
                              invoices.length) *
                              100}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Overdue */}
              <div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-sm text-red-600">
                      !
                    </span>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Overdue
                      </p>

                      <p className="text-xs text-slate-400">
                        Requires attention
                      </p>
                    </div>

                  </div>

                  <span className="text-lg font-semibold text-slate-800">
                    {overdueInvoices.length}
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{
                      width:
                        invoices.length > 0
                          ? `${(overdueInvoices.length /
                              invoices.length) *
                              100}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-5">

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Quotes
                    </p>

                    <p className="mt-2 text-xl font-semibold text-slate-800">
                      {quotes.length}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Clients
                    </p>

                    <p className="mt-2 text-xl font-semibold text-slate-800">
                      {clients.length}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;