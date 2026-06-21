const DashboardNavBar = ({ session }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <img
            src={session?.user?.image || "/default-avatar.png"}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavBar;
