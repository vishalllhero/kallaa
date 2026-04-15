import { useState } from 'react';
import { paymentApi } from '@/api';
import { paymentService } from '@/services/payment';
import { toast } from 'sonner';

interface PaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface OrderDetails {
  productId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalPrice: number;
}

interface PaymentResult {
  success: boolean;
  order?: any;
  error?: string;
}

export interface PaymentState {
  isCreatingOrder: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  error: string | null;
}

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isCreatingOrder: false,
    isProcessing: false,
    isCompleted: false,
    error: null,
  });

  const createOrder = async (amount: number, currency = 'INR') => {
    setPaymentState(prev => ({
      ...prev,
      isCreatingOrder: true,
      error: null,
    }));

    try {
      // Use placeholder service for now
      const orderData = await paymentService.createOrder(amount, currency);
      console.log('[Payment] Order created:', orderData);

      setPaymentState(prev => ({
        ...prev,
        isCreatingOrder: false,
      }));

      return orderData;

      // Future: Uncomment when Razorpay is ready
      // const orderData = await paymentApi.createOrder(amount);
      // console.log('[Payment] Order created:', orderData);
      // return orderData;
    } catch (error: any) {
      console.error('[Payment] Order creation failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create payment order';

      setPaymentState(prev => ({
        ...prev,
        isCreatingOrder: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
      throw error;
    }
  };

  const processPayment = async (
    orderData: any,
    orderDetails: OrderDetails,
    customerInfo: { name: string; email: string }
  ): Promise<PaymentResult> => {
    setPaymentState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      // Simulate payment processing delay (like a payment gateway)
      console.log('[Payment] Processing payment for order:', orderData.id);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use placeholder service for verification
      const verificationResult = await paymentService.verifyPayment({
        // Mock Razorpay response data
        razorpay_order_id: orderData.id,
        razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: 'mock_signature_for_development',
        orderDetails,
      });

      console.log('[Payment] Verification successful:', verificationResult);

      setPaymentState(prev => ({
        ...prev,
        isProcessing: false,
        isCompleted: true,
      }));

      toast.success('Payment successful. The masterpiece is now yours.');
      return { success: true, order: verificationResult.order };

    } catch (error: any) {
      console.error('[Payment] Verification failed:', error);
      const errorMessage = error.message || 'Payment verification failed';

      setPaymentState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));

      toast.error('Verification failed. Please contact support.');
      return { success: false, error: errorMessage };
    }
  };

  const resetPayment = () => {
    setPaymentState({
      isCreatingOrder: false,
      isProcessing: false,
      isCompleted: false,
      error: null,
    });
  };

  return {
    paymentState,
    createOrder,
    processPayment,
    resetPayment,
  };
};