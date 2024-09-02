// app.js
import { CartContextProvider } from '@/components/CartContext';
import '../styles/globals.css';
import Header from "@/components/Header";
import { Toaster } from 'react-hot-toast';
import Auth from '@/components/Auth';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/Footer';

export default function App({ 
  Component, pageProps : {session, ...pageProps } 
}) {
  
  return (
    <SessionProvider session={session}>
      <CartContextProvider>
        <Header />
        <Toaster position="top-center" reverseOrder={false} />
        <Auth>
          <Component {...pageProps} />
        </Auth>
        <Footer />
      </CartContextProvider>
    </SessionProvider>
  );
}
