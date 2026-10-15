export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  checkoutUrl: string;
}