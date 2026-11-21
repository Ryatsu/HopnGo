import { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";

import {
  getAllPayments,
  processPayment,
  confirmPayment,
  refundPayment,
} from "../../services/paymentService";

import { getAllRides } from "../../services/rideService";

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [rides, setRides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [paymentData, setPaymentData] = useState({
    rideId: "",
    method: "CASH",
  });

  // Fetch payments and rides
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentData, rideData] = await Promise.all([
        getAllPayments(),
        getAllRides(),
      ]);

      setPayments(paymentData);
      setRides(rideData);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to load payment records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Process payment
  const handleProcessPayment = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await processPayment(
        Number(paymentData.rideId),
        paymentData.method
      );

      setSuccess("Payment record created successfully!");

      setPaymentData({
        rideId: "",
        method: "CASH",
      });

      setShowForm(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to process payment."
      );
    }
  };

  // Confirm payment
  const handleConfirmPayment = async (paymentId) => {
    if (!window.confirm("Confirm this payment?")) return;

    try {
      setError("");
      setSuccess("");

      await confirmPayment(paymentId);

      setSuccess("Payment confirmed successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to confirm payment."
      );
    }
  };

  // Refund payment
  const handleRefundPayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to refund this payment?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await refundPayment(paymentId);

      setSuccess("Payment refunded successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to refund payment."
      );
    }
  };

  // Only completed rides without payments can be processed
  const eligibleRides = rides.filter(
    (ride) =>
      ride.status === "COMPLETED" &&
      !ride.payment
  );

  const totalPayments = payments.length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const paidPayments = payments.filter(
    (payment) => payment.status === "PAID"
  ).length;

  const refundedPayments = payments.filter(
    (payment) => payment.status === "REFUNDED"
  ).length;

  const totalRevenue = payments
    .filter((payment) => payment.status === "PAID")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const getStatusStyle = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700",
      PAID: "bg-green-100 text-green-700",
      FAILED: "bg-red-100 text-red-700",
      REFUNDED: "bg-purple-100 text-purple-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage ride payments, confirmations, and refunds.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          disabled={eligibleRides.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Process Payment
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {[
          {
            label: "Total Payments",
            value: totalPayments,
            icon: CreditCard,
            color: "text-blue-600",
          },
          {
            label: "Pending",
            value: pendingPayments,
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            label: "Paid",
            value: paidPayments,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Refunded",
            value: refundedPayments,
            icon: RefreshCw,
            color: "text-purple-600",
          },
          {
            label: "Total Revenue",
            value: `₱${totalRevenue.toFixed(2)}`,
            icon: Wallet,
            color: "text-emerald-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon size={24} className={item.color} />

              <p className="mt-3 text-sm text-slate-500">
                {item.label}
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Payment Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Payment Records
          </h2>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading payments...
          </p>
        ) : payments.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No payment records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">Payment ID</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Payment Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.paymentId}>

                    <td className="px-5 py-4 font-medium">
                      #{payment.paymentId}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      ₱{Number(payment.amount).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      {payment.method}
                    </td>

                    <td className="px-5 py-4">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="min-w-44 space-y-2 px-5 py-4">

                      {payment.status === "PENDING" && (
                        <button
                          onClick={() =>
                            handleConfirmPayment(payment.paymentId)
                          }
                          className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Confirm Payment
                        </button>
                      )}

                      {payment.status === "PAID" && (
                        <button
                          onClick={() =>
                            handleRefundPayment(payment.paymentId)
                          }
                          className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Refund Payment
                        </button>
                      )}

                      {["REFUNDED", "FAILED"].includes(payment.status) && (
                        <span className="text-xs text-slate-400">
                          No available actions
                        </span>
                      )}

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Payment Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Process Payment
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 p-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Completed Ride
                </label>

                <select
                  value={paymentData.rideId}
                  onChange={(e) =>
                    setPaymentData((previous) => ({
                      ...previous,
                      rideId: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  <option value="">Select completed ride</option>

                  {eligibleRides.map((ride) => (
                    <option key={ride.rideId} value={ride.rideId}>
                      Ride #{ride.rideId} — ₱
                      {Number(ride.fare || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Payment Method
                </label>

                <select
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData((previous) => ({
                      ...previous,
                      method: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  <option value="CASH">Cash</option>
                  <option value="GCASH">GCash</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PaymentManagement;