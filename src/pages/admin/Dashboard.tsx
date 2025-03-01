import { useEffect, useState } from "react";
import { BarChart3, Users, Package, DollarSign } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "-",
      change: "0%",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Active Customers",
      value: "-",
      change: "0%",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Monthly Revenue",
      value: "-",
      change: "0%",
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "Conversion Rate",
      value: "-",
      change: "0%",
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);

  const fetchRecentActivities = async () => {
    const { data, error } = await supabase
      .from("user_activities")
      .select("id, description, created_at")
      .order("created_at", { ascending: false }) 
      .limit(5); 

    if (error) {
      console.error("Error fetching recent activities:", error);
    } else {
      setRecentActivities(data);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch Total Products
      const { count: totalProducts, error: productsError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch Active Customers
      const { count: activeCustomers, error: customersError } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      // Fetch Monthly Revenue (assuming payment_history stores revenue)
      const { data: revenueData, error: revenueError } = await supabase
        .from("payment_history")
        .select("amount")
        .gte("created_at", new Date(new Date().setDate(1)).toISOString()); // Get current month's revenue

      const monthlyRevenue = revenueData
        ? revenueData.reduce((acc, cur) => acc + cur.amount, 0)
        : 0;

      // Fetch Conversion Rate (Assumption: conversion rate is views to purchases)
      const { count: totalViews, error: viewsError } = await supabase
        .from("product_views")
        .select("*", { count: "exact", head: true });

      const { count: totalPurchases, error: purchasesError } = await supabase
        .from("payment_history")
        .select("*", { count: "exact", head: true });

      const conversionRate =
        totalViews && totalPurchases
          ? ((totalPurchases / totalViews) * 100).toFixed(2)
          : "0";

      if (
        productsError ||
        customersError ||
        revenueError ||
        viewsError ||
        purchasesError
      ) {
        console.error("Error fetching stats");
        return;
      }

      setStats([
        {
          title: "Total Products",
          value: totalProducts?.toString() || "0",
          change: "+12%",
          icon: Package,
          color: "bg-blue-500",
        },
        {
          title: "Active Customers",
          value: activeCustomers?.toString() || "0",
          change: "+18%",
          icon: Users,
          color: "bg-green-500",
        },
        {
          title: "Monthly Revenue",
          value: `$${monthlyRevenue.toLocaleString()}`,
          change: "+25%",
          icon: DollarSign,
          color: "bg-yellow-500",
        },
        {
          title: "Conversion Rate",
          value: `${conversionRate}%`,
          change: "+4%",
          icon: BarChart3,
          color: "bg-purple-500",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    
    fetchStats();
    fetchRecentActivities();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                <stat.icon
                  className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent activity.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
