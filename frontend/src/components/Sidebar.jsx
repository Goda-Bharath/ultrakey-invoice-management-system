import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "General",
      path: "/",
      icon: "⚙️",
    },
    {
      name: "Business",
      path: "/clients",
      icon: "🏢",
    },
    {
      name: "Quotes",
      path: "/quotes",
      icon: "📄",
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: "🧾",
    },
    {
      name: "Payments",
      path: "/payment",
      icon: "💳",
    },
    {
      name: "Tax",
      path: "/tax",
      icon: "⚖️",
    },
    {
      name: "Emails",
      path: "/emails",
      icon: "✉️",
    },
    {
      name: "PDF",
      path: "/pdf",
      icon: "📑",
    },
    {
      name: "Translate",
      path: "/translate",
      icon: "🌐",
    },
    {
      name: "New Client",
      path: "/newclient",
      icon: "👤",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo / Company */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg text-white">
            U
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Ultrakey
            </h1>

            <p className="hidden text-xs text-gray-500 sm:block">
              Invoice Application
            </p>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <nav className="overflow-x-auto border-t border-gray-100">
        <div className="flex min-w-max px-3 sm:px-6">

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition sm:px-5 ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <span>
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>
      </nav>

    </header>
  );
}

export default Sidebar;