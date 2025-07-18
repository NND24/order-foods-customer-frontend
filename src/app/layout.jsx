"use client";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { ForgotPassEmailProvider } from "@/context/forgotPassEmailContext";
import { ProvinceProvider } from "@/context/provinceContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <HelmetProvider>
          <ForgotPassEmailProvider>
            <SocketProvider>
              <ProvinceProvider>
                <CartProvider>
                  <OrderProvider>
                    <FavoriteProvider>
                      {children}
                      <ToastContainer
                        position='top-right'
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme='light'
                      />
                    </FavoriteProvider>
                  </OrderProvider>
                </CartProvider>
              </ProvinceProvider>
            </SocketProvider>
          </ForgotPassEmailProvider>
        </HelmetProvider>
      </body>
    </html>
  );
}
