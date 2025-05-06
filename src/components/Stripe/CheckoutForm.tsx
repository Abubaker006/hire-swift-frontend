import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createCheckoutSession } from "@/apiServices/StripeAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";

const CheckoutForm = ({ amount }: { amount: number }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe.js or Elements are not loaded properly.");
      return;
    }

    setProcessing(true);

    try {
      const response = await createCheckoutSession(token,amount);

      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No redirect URL received.");
      }
    } catch (error) {
      setProcessing(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="card">Credit or Debit Card</label>
        <CardElement />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
