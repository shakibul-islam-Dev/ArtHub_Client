import DashboardSideBar from "../../components/dashboard/DashboardSideBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <DashboardSideBar />
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
