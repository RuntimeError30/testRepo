import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import Button from "./Button";

const Navbar = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navContainerRef = useRef(null);
  const navItems = ["About", "Announcements"];
  const { y: currentScrollY } = useWindowScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!navContainerRef.current) return;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY]);

  useEffect(() => {
    if (!navContainerRef.current) return;

    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Scroll to section if hash exists in the URL
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleNavigation = (hash) => {
    if (location.pathname !== "/") {
      // Navigate to the homepage with hash
      navigate(`/${hash}`);
    } else {
      // Scroll to the section directly
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed bg-black rounded-xl inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo Section */}
          <div className="flex items-center gap-7">
            <Link to="/">
              <img src="/img/logo.png" className="w-16" alt="Site Logo" />
            </Link>
            <Link to="/#events">
              <Button
                title="Events"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-white flex px-3 py-3 rounded-full text-black text-xs md:text-xs items-center"
              />
            </Link>
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              className="text-xl text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(`#${item.toLowerCase()}`)}
                className="nav-hover-btn text-white"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => navigate("/gratitude")} 
              className="nav-hover-btn text-white"
            >
              Our Team
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-40 md:hidden">
            <ul className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleNavigation(`#${item.toLowerCase()}`);
                    }}
                    className="text-black text-sm font-semibold hover:text-blue-600"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/gratitude");
                  }}
                  className="text-black text-sm font-semibold hover:text-blue-600"
                >
                  Our Team
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;



