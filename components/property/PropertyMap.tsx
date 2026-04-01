"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function PropertyMap({ location, lat, lng }: { location: string, lat: number, lng: number }) {
  // Use useEffect to fix default icon issues in Leaflet with Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-full min-h-[250px] relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="w-full h-full min-h-[250px]"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
