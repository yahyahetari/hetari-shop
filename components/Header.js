import { useContext, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, Search, ChevronDown, ChevronUp, UserCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "./CartContext";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { url: "/", label: "Home" },
  { url: "/products", label: "Products" },
];

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cart } = useContext(CartContext);
  const { data: session } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const menuRef = useRef(null);

  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleUserDropdown = (event) => {
    event.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const isSearchPage = router.pathname.startsWith('/search/');
      
      if (isSearchPage) {
        // استخراج قيمة البحث من عنوان URL في صفحة البحث
        const searchQuery = router.asPath.split('/search/')[1] || '';
        setQuery(decodeURIComponent(searchQuery));
      } else {
        // إذا لم تكن في صفحة البحث، اجعل حقل البحث فارغًا
        setQuery("");
      }
    };

    // تنفيذ الدالة مرة عند تحميل الصفحة
    handleRouteChange();

    // إضافة مستمع لتغيرات المسار
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      // إزالة المستمع عند تفكيك المكون
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

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

  return (
    <header className="flex items-center justify-between text-lg font-medium text-black">
      <div className="ml-3">
        <Link href='/'>
          <Image src="/logo.png" alt="logo" width={80} height={30} />
        </Link>
      </div>
      <nav className="hidden md:flex gap-4 items-center">
        {navLinks.map((link) => (
          <div key={link.label} className="relative">
            <Link href={link.url || "#"}
              className={`flex items-center hover:text-gray-600 cursor-pointer ${router.pathname === link.url ? "font-bold text-red-600" : ""}`}
              onClick={link.subLinks ? () => setDropdownOpen(!dropdownOpen) : handleLinkClick}
            >
              {link.label}
              {link.subLinks && (
                <span className="ml-1">
                  {dropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </Link>
            {link.subLinks && dropdownOpen && (
              <div className="absolute mt-2 text-center bg-white border border-gray-200 rounded-lg shadow-lg">
                {link.subLinks.map((subLink) => (
                  <Link key={subLink.url} href={subLink.url}
                    className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer ${router.pathname === subLink.url ? "font-bold text-red-600" : ""}`}
                    onClick={handleLinkClick}
                  >
                    {subLink.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <form onSubmit={handleSearch} className="flex gap-3 border border-grey-2 px-3 py-1 mr-1 items-center rounded-lg">
        <input
          className="outline-none max-sm:max-w-[120px] max-md:max-w-[200px] max-lg:max-w-[120px] bg-glass"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
        </button>
      </form>
  
      <div className="hidden md:flex items-center">
        <Link href="/cart" className="flex items-center p-2 mr-3 hover:text-gray-600 relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-8" viewBox="0 0 576 512">
            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
          </svg>
          {cart?.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </Link>
  
        {session ? (
          <div className="relative" ref={userDropdownRef}>
            <button onClick={handleUserDropdown} className="flex items-center">
              <Image
                src={session.user.image}
                alt="User"
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
            </button>
  
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                </div>
                <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/api/auth/signin" >
            <UserCircle2 className="w-9 h-8 mr-2" />
          </Link>
        )}
      </div>
      <div className="md:hidden flex items-center gap-2">
        <Menu onClick={(e) => {e.stopPropagation(); setMenuOpen(!menuOpen);}} className="cursor-pointer " />
        {!menuOpen && cart?.length > 0 && (
            <span className="absolute top-5 right-11 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cart.length}
            </span>          
        )}
        {session ? (
          <button onClick={() => router.push('/account')} className="flex items-center mr-2">
            <Image
              src={session.user.image}
              alt="User"
              width={32}
              height={32}
              className="rounded-full "
            />
          </button>
        ) : (
          <Link href="/api/auth/signin">
            <UserCircle2 className="w-9 h-8 mr-2" />
          </Link>
        )}
        
      </div>
      {menuOpen && (
        <div ref={menuRef} className="absolute top-16 right-0 w-full p-4 bg-white flex flex-col items-center gap-4 md:hidden z-50">
          {navLinks.map((link) => (
            <div key={link.label} className="w-full text-center">
              <Link href={link.url || "#"}
                className={`flex justify-center items-center p-2 hover:text-gray-600 cursor-pointer ${router.pathname === link.url ? "font-bold text-red-600" : ""}`}
                onClick={link.subLinks ? () => setDropdownOpen(!dropdownOpen) : handleLinkClick}
              >
                {link.label}
                {link.subLinks && (
                  <span className="ml-1">
                    {dropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </Link>
              {link.subLinks && dropdownOpen && (
                <div className="w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {link.subLinks.map((subLink) => (
                    <Link key={subLink.url} href={subLink.url}
                      className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer ${router.pathname === subLink.url ? "font-bold text-red-600" : ""}`}
                      onClick={handleLinkClick}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/cart" className="flex items-center p-2 mr-3 hover:text-gray-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-8" viewBox="0 0 576 512">
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
            {cart?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}  