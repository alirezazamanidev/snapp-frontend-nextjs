'use client';

export default function DriverControllPanel() {
    return (
        <div className="h-1/4 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700 flex flex-col">
          <div className="flex-1 flex flex-col p-4 justify-center">
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg text-lg"
            >
              Request Passenger
            </button>
          </div>
        </div>
    );
}