import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
    try {
      const response = await fetch("/api/deleteUser", {
        method: "DELETE",
      });

      if (response.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={40} className="mb-4" />
          </Link>
          <p className="text-gray-400 text-sm">© 2024 Your Store Name. All rights reserved.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-gray-400 text-sm">
              <li className="mb-2"><Link href="/">Home</Link></li>
              <li className="mb-2"><Link href="/products">Products</Link></li>
              <li className="mb-2"><Link href="/categories">Categories</Link></li>
              <li className="mb-2"><Link href="/account">Your Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Customers</h4>
            <ul className="text-gray-400 text-sm">
              <li className="mb-2"><Link href="/account">My Account</Link></li>
              <li className="mb-2"><Link href="/cart">Cart</Link></li>
              <li className="mb-2"><Link href="/checkout">Checkout</Link></li>
              <li className="mb-2"><Link href="/account">Orders</Link></li>
              <li className="mb-2 cursor-pointer" onClick={handleSignOut}>Log out</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="text-gray-400 text-sm">
              <li className="mb-2">Email: support@yourstore.com</li>
              <li className="mb-2">Phone: +123 456 789</li>
              <li className="mb-2">Address: 1234 Street Name, City, Country</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6 md:mt-0">
          <Link href="https://facebook.com" target="_blank">
            <Facebook className="text-white hover:text-blue-500 w-6 h-6" />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <Twitter className="text-white hover:text-blue-400 w-6 h-6" />
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <Instagram className="text-white hover:text-pink-500 w-6 h-6" />
          </Link>
          <Link href="https://linkedin.com" target="_blank">
            <Linkedin className="text-white hover:text-blue-700 w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
