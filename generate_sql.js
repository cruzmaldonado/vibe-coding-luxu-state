const fs = require('fs');
const { v4: uuidv4 } = require('crypto');

const titles = [
  "Mountain View Villa", "Oceanfront Estate", "Downtown Loft", "Suburban Oasis",
  "Lakeside Retreat", "Modern City Condominium", "Historic Townhouse", "Desert Modern Home",
  "Seaside Cottage", "Urban Penthouse", "Hilltop Mansion", "Woodland Cabin",
  "Coastal Contemporary", "Golf Course Estate", "Ski Chalet", "Riverfront Property",
  "Equestrian Farm", "Eco-friendly Tiny Home", "Mid-century Modern", "Tropical Villa"
];

const locations = [
  "Boulder, CO", "Malibu, CA", "Austin, TX", "Evanston, IL",
  "Lake Tahoe, NV", "New York, NY", "Boston, MA", "Scottsdale, AZ",
  "Carmel, CA", "Miami, FL", "Beverly Hills, CA", "Asheville, NC",
  "Newport, RI", "Pebble Beach, CA", "Aspen, CO", "Portland, OR",
  "Lexington, KY", "Portland, ME", "Palm Springs, CA", "Maui, HI"
];

const coords = [
  [40.015, -105.2705], [34.0259, -118.7798], [30.2672, -97.7431], [42.0451, -87.6877],
  [39.0968, -120.0324], [40.7128, -74.006], [42.3601, -71.0589], [33.4942, -111.9261],
  [36.5552, -121.9233], [25.7617, -80.1918], [34.0736, -118.4004], [35.5951, -82.5515],
  [41.4901, -71.3128], [36.5686, -121.9547], [39.1911, -106.8175], [45.5152, -122.6784],
  [38.0406, -84.5037], [43.6615, -70.2553], [33.8303, -116.5453], [20.7984, -156.3319]
];

const prices = [
  2100000, 5500000, 9500000, 1250000, 3200000, 1850000, 2400000, 1750000,
  1450000, 4200000, 8500000, 850000, 2900000, 6500000, 4800000, 1600000,
  3500000, 450000, 2200000, 7200000
];

const images = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
];

let sql = "INSERT INTO properties (title, price_formatted, location, beds, baths, area, slug, images, is_new, featured, lat, lng, image_alt, tags)\nVALUES\n";

const values = [];

for (let i = 0; i < 20; i++) {
  const title = titles[i].replace(/'/g, "''");
  const price = "$" + prices[i].toLocaleString();
  const loc = locations[i].replace(/'/g, "''");
  const beds = Math.floor(Math.random() * 4) + 2;
  const baths = Math.floor(Math.random() * 3) + 2;
  const area = Math.floor(Math.random() * 3000) + 1500;
  const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(7);
  const lat = coords[i][0];
  const lng = coords[i][1];
  const is_new = Math.random() > 0.5 ? true : false;
  
  values.push(`('${title}', '${price}', '${loc}', ${beds}, ${baths}, ${area}, '${slug}', ARRAY['${images[0]}', '${images[1]}', '${images[2]}']::text[], ${is_new}, false, ${lat}, ${lng}, '${title} exterior view', ARRAY['Placeholder', 'Real Estate', 'Modern'])`);
}

sql += values.join(",\n") + ";\n";

fs.writeFileSync('insert_properties.sql', sql);
console.log("SQL generated.");
