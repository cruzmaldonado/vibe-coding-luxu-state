import { getPropertyBySlug } from '@/lib/data/properties';
import { notFound } from 'next/navigation';
import PropertyDetailContent from '@/components/property/PropertyDetailContent';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) return { title: 'Property Not Found' };

  return {
    title: `${property.title} | LuxeEstate`,
    description: `View details for ${property.title} located in ${property.location}. Price: ${property.price_formatted}.`,
    openGraph: {
      images: [property.images?.[0] ?? ''],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetailContent property={property} />;
}
