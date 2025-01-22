import React, { useState } from "react";
import logo from "../assets/logo.png"; // Ensure the correct path to your logo
import { Link } from "react-router-dom";

function NavBar() {
    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
        alert(`Subscribed with ${email}`);
    };

    return (
        <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center py-5 relative"> {/* Increased py-3 to py-5 */}
                {/* Left: Menu Icon */}
                <button className="text-2xl text-gray-800">&#9776;</button>

                {/* Center: Logo Image (Positioned to the center) */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link to={"/"}>
                        <img 
                            src={logo} 
                            alt="SiliconFeed Logo" 
                            className="h-14 w-auto" 
                        />
                    </Link>
                    
                </div>

                {/* Right: Subscribe Button (Visible on small screens) */}
                {/* <div className="hidden md:flex items-center space-x-2">
                    <button 
                        onClick={handleSubscribe} 
                        className="bg-black text-white border-2 border-black px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300"
                    >
                        Subscribe
                    </button>
                </div> */}

                {/* Right: Subscribe Button on Smaller Screens (Visible only on small screens) */}
                {/* <div className="md:hidden flex items-center">
                    <button 
                        onClick={handleSubscribe} 
                        className="bg-black text-white border-2 border-black px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300"
                        >
                        Subscribe
                    </button>
                </div> */}
            </div>
        </nav>
    );
}

export default NavBar;
