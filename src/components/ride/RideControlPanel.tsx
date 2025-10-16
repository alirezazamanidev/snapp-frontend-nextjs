'use client';

interface RideControlPanelProps {
  step: 'origin' | 'destination' | 'complete';
  originPosition: [number, number] | null;
  destinationPosition: [number, number] | null;
  userLocation: [number, number] | null;
  isLoadingRoute: boolean;
  isLoadingLocation: boolean;
  onConfirmOrigin: () => void;
  onConfirmDestination: () => void;
  onFindDriver: () => void;
  onGetUserLocation: () => void;
}

export default function RideControlPanel({
  step,
  originPosition,
  destinationPosition,
  userLocation,
  isLoadingRoute,
  isLoadingLocation,
  onConfirmOrigin,
  onConfirmDestination,
  onFindDriver,
  onGetUserLocation,
}: RideControlPanelProps) {
  const getTitle = () => {
    switch (step) {
      case 'origin':
        return 'Select Pickup Location';
      case 'destination':
        return 'Select Destination';
      case 'complete':
        return isLoadingRoute ? 'Loading Route...' : 'Route Selected';
      default:
        return '';
    }
  };

  return (
    <div className="h-1/4 mb-15 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700 flex flex-col">
      <div className="flex-1 flex flex-col p-4 space-y-3">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
        </div>

        <div className="space-y-3">
          {step === 'origin' && (
            <>
              <LocationInput
                label="Pickup Location"
                position={originPosition}
                placeholder="Drag marker or click on map to set pickup location"
                color="green"
              />

              <button
                onClick={onGetUserLocation}
                disabled={isLoadingLocation}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-xl transition-all duration-200 shadow-lg text-sm"
              >
                {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
              </button>

              {userLocation && (
                <div className="text-center text-xs text-gray-400">
                  Blue marker shows your location. Click on it to use as pickup
                  point.
                </div>
              )}
            </>
          )}

          {step === 'destination' && (
            <>
              <LocationInput
                label="Pickup Location"
                position={originPosition}
                placeholder=""
                color="green"
              />
              <LocationInput
                label="Destination"
                position={destinationPosition}
                placeholder="Drag marker or click on map to set destination"
                color="red"
              />
            </>
          )}

          {step === 'complete' && (
            <>
              <LocationInput
                label="Pickup Location"
                position={originPosition}
                placeholder=""
                color="green"
              />
              <LocationInput
                label="Destination"
                position={destinationPosition}
                placeholder=""
                color="red"
              />
            </>
          )}
        </div>

        {step === 'origin' && (
          <button
            onClick={onConfirmOrigin}
            disabled={!originPosition}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg text-sm"
          >
            Confirm Pickup Location
          </button>
        )}

        {step === 'destination' && (
          <button
            onClick={onConfirmDestination}
            disabled={!destinationPosition || isLoadingRoute}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg text-sm"
          >
            {isLoadingRoute ? 'Loading Route...' : 'Confirm Destination'}
          </button>
        )}

        {step === 'complete' && !isLoadingRoute && (
          <button
            onClick={onFindDriver}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg text-sm"
          >
            Find Driver
          </button>
        )}
      </div>
    </div>
  );
}
interface LocationInputProps {
  label: string;
  position: [number, number] | null;
  placeholder: string;
  color: 'green' | 'red';
}

function LocationInput({
  label,
  position,
  placeholder,
  color,
}: LocationInputProps) {
  const colorClass = color === 'green' ? 'bg-green-500' : 'bg-red-500';
  const focusClass =
    color === 'green' ? 'focus:ring-green-500' : 'focus:ring-red-500';

  return (
    <div className="relative">
      <div
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 ${colorClass} rounded-full`}
      ></div>
      <input
        type="text"
        placeholder={placeholder}
        value={
          position ? `${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : ''
        }
        readOnly
        className={`w-full pl-8 pr-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 ${focusClass} focus:border-transparent text-sm`}
      />
    </div>
  );
}
