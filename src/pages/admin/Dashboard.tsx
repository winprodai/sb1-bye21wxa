import React from 'react';
import { BarChart3, Users, Package, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "247",
      change: "+12%",
      icon: Package,
      color: "bg-blue-500"
    },
    {
      title: "Active Customers",
      value: "1,432",
      change: "+18%",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Monthly Revenue",
      value: "$24,500",
      change: "+25%",
      icon: DollarSign,
      color: "bg-yellow-500"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+4%",
      icon: BarChart3,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New customer signed up</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;