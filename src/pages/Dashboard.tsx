import { useCallback, useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserDashboard } from "../services/dashboardService";
import type {
  DashboardStats,
  RecentOrder,
  SpendingMonth,
} from "../types/dashboard";

const formatPrice = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (status: RecentOrder["status"]): string => {
  if (status === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "failed") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

const getStatusLabel = (status: RecentOrder["status"]): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

function Dashboard() {
  const { profile, refreshProfile } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [spending, setSpending] = useState<SpendingMonth[]>([]);

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const [firstName, setFirstName] = useState(profile?.first_name ?? "");

  const [lastName, setLastName] = useState(profile?.last_name ?? "");

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getUserDashboard();

      setStats(data.dashboard.stats);
      setSpending(data.dashboard.spendingOverLastSixMonths);
      setRecentOrders(data.dashboard.recentOrders);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Dashboard data is unavailable.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    setFirstName(profile?.first_name ?? "");
    setLastName(profile?.last_name ?? "");
    setAvatarUrl(profile?.avatar_url ?? null);
  }, [profile]);

  const handleProfileUpdate = async () => {
    if (!profile) {
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileMessage("");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      await refreshProfile();

      setProfileMessage("Profile updated successfully.");
    } catch (updateError) {
      setProfileMessage(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update profile.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !profile) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setProfileMessage("Only JPG, PNG, and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage("Image size must be 2MB or less.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setProfileMessage("");

      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";

      const filePath = `${profile.id}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setAvatarUrl(publicUrl);

      await refreshProfile();

      setProfileMessage("Profile image updated successfully.");
    } catch (uploadError) {
      setProfileMessage(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload profile image.",
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd2] border-t-[#b45f3c]" />
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-base font-semibold text-red-700">
            Unable to load dashboard
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error || "Dashboard data is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-lg bg-[#b45f3c] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9f5031]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#b45f3c]">My Account</p>

          <h1 className="mt-1 text-3xl font-bold text-[#51463d]">Dashboard</h1>

          <p className="mt-2 text-sm text-[#756b62]">
            Track your orders, spending, and profile.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756b62]">Total Orders</p>

                <p className="mt-2 text-2xl font-bold text-[#51463d]">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="rounded-xl bg-[#f3e4d8] p-3 text-[#a65332]">
                <ShoppingBag size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756b62]">Total Spent</p>

                <p className="mt-2 text-2xl font-bold text-[#51463d]">
                  {formatPrice(stats.totalSpent)}
                </p>
              </div>

              <div className="rounded-xl bg-[#f3e4d8] p-3 text-[#a65332]">
                <Wallet size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#756b62]">Pending Orders</p>

                <p className="mt-2 text-2xl font-bold text-[#51463d]">
                  {stats.pendingOrders}
                </p>
              </div>

              <div className="rounded-xl bg-[#f3e4d8] p-3 text-[#a65332]">
                <Clock3 size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <section className="mt-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#51463d]">
              Spending — Last 6 Months
            </h2>

            <p className="mt-1 text-sm text-[#756b62]">
              Your spending activity over the last six months.
            </p>
          </div>

          {spending.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center">
              <p className="text-sm text-[#756b62]">
                No spending data available.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spending}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis
                    tickFormatter={(value) => formatPrice(Number(value))}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatPrice(typeof value === "number" ? value : 0),
                      "Spent",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#b45f3c"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Recent Orders */}
        <section className="mt-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#51463d]">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-[#756b62]">Your latest orders.</p>
            </div>

            <CheckCircle2 size={22} className="text-[#b45f3c]" />
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-xl bg-[#fbf7f2] p-8 text-center">
              <p className="text-sm text-[#756b62]">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e7ddd2]">
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Order
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Date
                    </th>

                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Status
                    </th>

                    <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5dc]">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-3 py-4 text-sm font-medium text-[#51463d]">
                        #{order.id.slice(0, 8)}
                      </td>

                      <td className="px-3 py-4 text-sm text-[#655b52]">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-right text-sm font-semibold text-[#51463d]">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Profile */}
        <section className="mt-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#51463d]">Profile</h2>

            <p className="mt-1 text-sm text-[#756b62]">
              Update your name and profile image.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:w-64 lg:flex-col">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f3e4d8] text-3xl font-bold text-[#a65332]">
                  {(firstName || profile?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d9cec2] px-4 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]">
                <Camera size={16} />

                {isUploadingAvatar ? "Uploading..." : "Change Photo"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-[#756b62]">
                JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>

            {/* Profile Form */}
            <div className="flex-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-[#51463d]"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none transition focus:border-[#b45f3c]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-[#51463d]"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none transition focus:border-[#b45f3c]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#51463d]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full rounded-lg border border-[#e7ddd2] bg-[#fbf7f2] px-3 py-2.5 text-sm text-[#756b62]"
                />
              </div>

              {profileMessage && (
                <p className="mt-4 rounded-lg bg-[#fbf7f2] px-4 py-3 text-sm text-[#655b52]">
                  {profileMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => void handleProfileUpdate()}
                disabled={isSavingProfile}
                className="mt-4 rounded-lg bg-[#b45f3c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9f5031] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
