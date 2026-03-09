// pages/_app.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import { OrderProvider } from '../context/OrderContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <AuthProvider>
                <div
                  className="min-h-screen flex flex-col"
                  style={{ background: 'var(--bg)', color: 'var(--fg)' }}
                >
                  <Navbar />
                  <CartSidebar />
                  <main className="flex-1">
                    <Component {...pageProps} />
                  </main>
                  <Footer />
                  <Toaster
                    position="bottom-center"
                    toastOptions={{
                      style: {
                        background: 'var(--card)',
                        color: 'var(--fg)',
                        border: '1px solid var(--border)',
                      },
                      success: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
                    }}
                  />
                </div>
              </AuthProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}