import { Header } from "./components/layout/Header";
import { DashboardHeader } from "./components/layout/dashboard/DashboardHeader";
import { StatCard } from "./components/layout/dashboard/StatCard";
import { TransactionOverview } from "./components/layout/dashboard/TransactionOverview";
import { DistrictPerformance } from "./components/layout/dashboard/DistrictPerformance";
import { DistrictDistribution } from "./components/layout/dashboard/DistrictDistribution";
import { DistrictTable } from "./components/layout/dashboard/DistrictTable";
import { TransactionTable } from "./components/layout/dashboard/TransactionTable";
import { FulfillmentGauge } from "./components/layout/dashboard/FulfillmentGauge";
import { topStats } from "./data/dashboardData";

function App() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Header />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <DashboardHeader />

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {topStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <TransactionOverview />
            <DistrictPerformance />
          </div>

          <div className="space-y-6">
            <FulfillmentGauge />
            <DistrictDistribution />
          </div>
          <TransactionTable />
        </div>
          <div className="mt-6" >

        <div className="mt-6" >
            <DistrictTable />
            </div>
          </div>
      </main>
    </div>
  );
}

export default App;
