import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    alert(`Subscribed with ${email}`);
  };

  return (
    <footer className="bg-gray-400 text-white mt-10 py-6">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Newsletter Signup */}
        {/* <div>
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <div className="flex items-center mt-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 rounded-md text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe} className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2">
              Subscribe
            </button>
          </div>
        </div> */}

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold colo-">Contact Us</h3>
          <p>Email: sivaavanishk@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
