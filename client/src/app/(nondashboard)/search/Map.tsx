"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

// Fix marker icon issue in Leaflet (important for Next.js)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const filters = useAppSelector((state) => state.global.filters);
  const { data: properties, isLoading, isError } = useGetPropertiesQuery(filters);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  const defaultCenter = filters.coordinates || [40, -74.5]; // Default to some location (NYC area)

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        {/* Tile Layer (Using OpenStreetMap) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Property Markers */}
        {properties.map((property: Property) => (
          <Marker
            key={property.id}
            position={[
              property.location.coordinates.latitude,
              property.location.coordinates.longitude,
            ]}
            icon={customIcon}
          >
            <Popup>
              <div className="marker-popup">
                <div>
                  <a href={`/search/${property.id}`} target="_blank" className="marker-popup-title">
                    {property.name}
                  </a>
                  <p className="marker-popup-price">
                    ${property.pricePerMonth} <span className="marker-popup-price-unit">/ month</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;