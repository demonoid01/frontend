import { ShoppingCart, Users, Package, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <header className="flex justify-between flex-col items-start gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <div className=" shadow-sm rounded-lg p-6 flex items-center space-x-4">
          <DollarSign className="text-blue-600 w-8 h-8" />
          <div>
            <h3 className="text-gray-100">Total Sales</h3>
            <p className="text-xl font-bold text-gray-200">$124,500</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className=" shadow-sm rounded-lg p-6 flex items-center space-x-4">
          <ShoppingCart className="text-green-600 w-8 h-8" />
          <div>
            <h3 className="text-gray-100">Total Orders</h3>
            <p className="text-xl font-bold text-gray-200">1,245</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className=" shadow-sm rounded-lg p-6 flex items-center space-x-4">
          <Users className="text-yellow-600 w-8 h-8" />
          <div>
            <h3 className="text-gray-100">Total Customers</h3>
            <p className="text-xl font-bold text-gray-200">845</p>
          </div>
        </div>

        {/* Products in Stock */}
        <div className=" shadow-sm rounded-lg p-6 flex items-center space-x-4">
          <Package className="text-purple-600 w-8 h-8" />
          <div>
            <h3 className="text-gray-100">Products in Stock</h3>
            <p className="text-xl font-bold text-gray-200">320</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className=" shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-x-2">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-black  py-">
                <th className="border border-gray-200 px-4 py-4">Date</th>
                <th className="border border-gray-200 px-4 py-4">Customer</th>
                <th className="border border-gray-200 px-4 py-4">Order ID</th>
                <th className="border border-gray-200 px-4 py-4">Amount</th>
                <th className="border border-gray-200 px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "2025/03/15",
                  customer: "John Doe",
                  orderId: "#12345",
                  amount: "$250",
                  status: "Completed",
                },
                {
                  date: "2025/03/14",
                  customer: "Jane Smith",
                  orderId: "#12344",
                  amount: "$180",
                  status: "Pending",
                },
                {
                  date: "2025/03/13",
                  customer: "Mike Johnson",
                  orderId: "#12343",
                  amount: "$320",
                  status: "Shipped",
                },
              ].map((activity, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "" : "bg-gray-900"}
                >
                  <td className="border border-gray-200 px-4 py-5">
                    {activity.date}
                  </td>
                  <td className="border border-gray-200 px-4 py-5">
                    {activity.customer}
                  </td>
                  <td className="border border-gray-200 px-4 py-5">
                    {activity.orderId}
                  </td>
                  <td className="border border-gray-200 px-4 py-5">
                    {activity.amount}
                  </td>
                  <td className="border border-gray-200 px-4 py-5">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activity.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
