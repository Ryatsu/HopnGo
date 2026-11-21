import { useEffect, useState } from "react";
import { CreditCard, Wallet, Clock, CheckCircle, Receipt } from "lucide-react";
import { getPaymentsByPassenger } from "../../services/paymentService";

function PaymentHistory() {
  const passengerId = 1; // Temporary passenger ID

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await getPaymentsByPassenger(passengerId);
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        setError("Unable to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalAmount = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const paidCount = payments.filter(
    (payment) => payment.status === "PAID"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount || 0);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-PH", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not available";

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REFUNDED":
        return "bg-blue-100 text-blue-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading payment history...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Payment History
        </h1>
        <p className="mt-1 text-gray-500">
          View your Hop'nGo payment transactions.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <Receipt className="text-blue-500" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">{payments.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Amount Paid</p>
            <Wallet className="text-green-500" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <Clock className="text-yellow-500" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">{pendingCount}</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold text-gray-800">
            Transaction Records
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {paidCount} successfully paid transaction(s)
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="mx-auto mb-3 text-gray-300" size={40} />
            <h3 className="font-semibold text-gray-700">
              No Payment Records
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your payment transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4">Payment ID</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      #{payment.paymentId}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {payment.method}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;