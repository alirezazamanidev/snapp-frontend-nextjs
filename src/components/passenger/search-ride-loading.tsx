export default function SearchRideLoading() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-16 right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl animate-bounce animation-delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        {/* Animated Car with Road Effect */}
        <div className="relative mb-12">
          {/* Road Lines */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-2">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-1 animate-pulse animation-delay-200"></div>
          </div>
          
          {/* Car Container with Multiple Rings */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin opacity-30"></div>
            {/* Middle Ring */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-ping opacity-40"></div>
            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse opacity-60"></div>
            
            {/* Car Icon with Glow */}
            <div className="absolute inset-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-bounce">
              <svg className="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Enhanced Title Section */}
        <div className="text-center space-y-6 mb-8">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text animate-pulse drop-shadow-2xl">
              🚗 Finding Your Ride
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur opacity-20 animate-pulse"></div>
          </div>
          
          <p className="text-gray-200 text-xl leading-relaxed max-w-md mx-auto font-medium">
            ✨ Connecting you with the perfect driver nearby
          </p>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="flex justify-center items-center space-x-3 mb-8">
          <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce animation-delay-200 shadow-lg shadow-blue-500/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce animation-delay-400 shadow-lg shadow-purple-500/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce animation-delay-600 shadow-lg shadow-pink-500/50"></div>
        </div>

        {/* Status Cards */}
        <div className="space-y-4 w-full max-w-sm">
          <div className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-5 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-white text-base font-semibold">🔍 Scanning area...</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-800/60 via-purple-800/60 to-pink-800/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
            <div className="text-center">
              <p className="text-blue-200 text-sm font-medium">
                ⚡ Average wait time: <span className="text-yellow-300 font-bold">2-3 minutes</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      <div className="p-6 bg-gradient-to-t from-black/50 via-gray-900/80 to-transparent backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 rounded-t-3xl"></div>
        <div className="relative z-10">
          <button className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white py-5 px-8 rounded-3xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 border border-red-400/30">
            ❌ Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
}