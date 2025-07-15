"use client";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { ForgotPassEmailProvider } from "@/context/forgotPassEmailContext";
import { ProvinceProvider } from "@/context/provinceContext";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <HelmetProvider>
          <ForgotPassEmailProvider>
            <ProvinceProvider>
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
            </ProvinceProvider>
          </ForgotPassEmailProvider>
        </HelmetProvider>
      </body>
    </html>
  );
}
