"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { toast } from "react-toastify";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const { refreshOrder } = useOrder();

  useEffect(() => {
    const completeOrder = async () => {
      const pendingOrder = localStorage.getItem("pendingOrder");
      if (!pendingOrder) {
        toast.error("Không tìm thấy thông tin đơn hàng.");
        router.replace("/orders");
        return;
      }

      const orderData = JSON.parse(pendingOrder);

      try {
        const response = await cartService.completeCart({
          ...orderData,
          paymentMethod: "VNPay",
        });
        toast.success("Thanh toán thành công!");
        refreshOrder();
        refreshCart();
        localStorage.removeItem("pendingOrder");
        router.replace(`/orders/detail-order/${response.orderId}`);
      } catch (error) {
        console.error("Lỗi completeCart:", error);
        toast.error("Không thể xác nhận đơn hàng.");
        router.replace("/orders");
      }
    };

    completeOrder();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold text-green-600'>Đang xác nhận đơn hàng...</h1>
    </div>
  );
}
