// src/components/Map.tsx
"use client";

import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MyMapProps {
  initialPosition: [number, number];
  zoom: number;
  onLocationSelect?: (position: [number, number]) => void;
}

const MyMap: React.FC<MyMapProps> = ({ initialPosition, zoom, onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        if (onLocationSelect) {
          onLocationSelect(newPos);
        }
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          Latitude: {position[0]}, Longitude: {position[1]}
        </Popup>
      </Marker>
    );
  };

  return (
    <MapContainer center={initialPosition} zoom={zoom} scrollWheelZoom={false} style={{ height: "40vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default MyMap;
