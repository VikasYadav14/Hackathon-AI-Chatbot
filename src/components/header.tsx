import React from 'react';

const Header = () => {
    return (
        <div className="absolute w-full bg-gray-700 text-white flex justify-between items-center p-4">
            <div className="flex justify-between items-center text-lg font-medium">
                <img
                    src="https://speed.wattmonk.com/assets/images/logo/wattmonklogo.png"
                    alt="wattmonk logo"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <p>Wattmonk Technologies</p>
            </div>
            <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center">
                V
            </div>
        </div>
    );
};

export default Header;