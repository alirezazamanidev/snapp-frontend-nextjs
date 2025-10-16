export const getRideRoute = async (
    origin: [number, number],
    destination: [number, number],
  ): Promise<[number, number][]> => {
    try {
      // استفاده از API کلید صحیح و ساختار درست URL
      const apiKey =
        'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijg3MzU1MWExZTQwMzQ1N2Q4OTY1ZjIwNTI5ODNhNGMzIiwiaCI6Im11cm11cjY0In0=';
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`,
        {
          method: 'GET',
          headers: {
            Accept:
              'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // بررسی وجود داده‌های مسیر
      if (
        !data.features ||
        !data.features[0] ||
        !data.features[0].geometry ||
        !data.features[0].geometry.coordinates
      ) {
        throw new Error('Invalid route data received');
      }
  
      const coordinates = data.features[0].geometry.coordinates;
  
      // تبدیل از [lng, lat] به [lat, lng] برای Leaflet
      return coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    } catch (error) {
  
      // در صورت شکست هر دو سرویس، خط مستقیم برگردان
      return [origin, destination];
    }
  };