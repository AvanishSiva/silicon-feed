// Loading.js
import React from 'react';
import NavBar from './NavBar';

const Loading = () => {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold tracking-wide">Loading, please wait...</p>
        </div>
      </div>
    );
  };
  
  export default Loading;
  
