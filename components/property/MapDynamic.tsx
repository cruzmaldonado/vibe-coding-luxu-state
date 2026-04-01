"use client";

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[250px] bg-slate-100 animate-pulse rounded-lg" />
});

export default function MapDynamic({ location, lat, lng }: { location: string, lat: number, lng: number }) {
  return <PropertyMap location={location} lat={lat} lng={lng} />;
}
