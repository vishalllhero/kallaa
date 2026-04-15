// Payment service - future-ready for Razorpay integration
// Currently implements placeholder payment for development

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentVerificationData {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  orderDetails: {
    productId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    totalPrice: number;
  };
}

export interface PaymentResult {
  success: boolean;
  order?: any;
  error?: string;
}

class PaymentService {
  // Placeholder: Create payment order
  async createOrder(amount: number, currency = 'INR'): Promise<PaymentOrder> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock order for development
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: orderId,
      amount: amount * 100, // Convert to paisa for consistency
      currency,
      status: 'created'
    };
  }

  // Placeholder: Verify payment
  async verifyPayment(data: PaymentVerificationData): Promise<PaymentResult> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful verification for development
    const mockOrder = {
      _id: `mock_order_${Date.now()}`,
      ...data.orderDetails,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: new Date()
    };

    return {
      success: true,
      order: mockOrder
    };
  }

  // Future: Initialize Razorpay
  // This will be called when Razorpay keys are available
  initializeRazorpay() {
    // TODO: Implement when Razorpay keys are configured
    console.log('[PaymentService] Razorpay initialization skipped - no keys configured');
  }
}

// Export singleton instance
export const paymentService = new PaymentService();