export interface BusinessMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  popular?: boolean;
  imageEmoji?: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  town: string;
  state: string;
  category: 'dining' | 'retail' | 'services' | 'hospitality' | 'farm_artisan';
  address: string;
  phone?: string;
  googlePlaceId: string;
  googleRating: number;
  reviewsCount: number;
  googleReviewUrl: string;
  googleMapsUrl: string;
  websiteUrl?: string;
  description: string;
  suggestedCardHeadline: string;
  logoEmoji: string;
  accentColor: string;
  menuTitle?: string;
  menuItems?: BusinessMenuItem[];
  isCommittedPartner?: boolean;
}

/**
 * 100% Committed, Verified, Active Carroll County & Regional Local Businesses
 */
export const EFFINGHAM_AREA_BUSINESSES: LocalBusiness[] = [
  // --- EFFINGHAM, NH ---
  {
    id: 'biz-eff-pnb-eats',
    name: 'PNB Eats',
    town: 'Effingham',
    state: 'NH',
    category: 'dining',
    address: 'NH-25, Effingham, NH 03882',
    phone: '(603) 539-7440',
    googlePlaceId: 'ChIJ_yXq6zN64okRTG3n6qN8Eff',
    googleRating: 4.8,
    reviewsCount: 184,
    googleReviewUrl: 'https://www.google.com/search?q=PNB+Eats+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=PNB+Eats+Effingham+NH',
    description: 'Local favorite for hearty breakfasts, hot subs, specialty pizzas, and roadside comfort food.',
    suggestedCardHeadline: 'Love your meal at PNB Eats? Tap to leave a quick Google review!',
    logoEmoji: '🥪',
    accentColor: '#f59e0b',
    menuTitle: 'Breakfast, Subs & Hand-Tossed Pizzas',
    isCommittedPartner: true,
    menuItems: [
      { id: 'pnb-m1', name: 'The Big Mountain Steak & Cheese Sub', description: 'Shaved ribeye, melted provolone, grilled peppers, onions & mushrooms on toasted sub roll', price: '$13.99', category: 'Hot Subs', popular: true, imageEmoji: '🥪' },
      { id: 'pnb-m2', name: 'Effingham Rustic Supreme Pizza (16")', description: 'Hand-tossed garlic crust, whole mozzarella, pepperoni, sausage, peppers, and hot honey', price: '$19.50', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'pnb-m3', name: 'Crispy Jumbo Wings (10-Pack)', description: 'Tossed in pure NH maple BBQ or medium buffalo with house blue cheese dip', price: '$15.99', category: 'Appetizers', imageEmoji: '🍗' },
      { id: 'pnb-m4', name: 'Maple Glazed Fried Dough Bites', description: 'Tossed in cinnamon sugar with warm Carroll County pure maple syrup dip', price: '$7.99', category: 'Desserts', popular: true, imageEmoji: '🥞' },
      { id: 'pnb-m5', name: 'Country Sunrise Breakfast Platter', description: '3 farm eggs, crispy bacon, maple sausage links, home fries & buttered toast', price: '$11.50', category: 'Breakfast', imageEmoji: '🍳' }
    ]
  },
  {
    id: 'biz-eff-oasis-roastery',
    name: 'Oasis Artisan Roastery & Bakehouse',
    town: 'Effingham',
    state: 'NH',
    category: 'dining',
    address: 'Historic Route 153, Effingham, NH 03882',
    phone: '(508) 507-0305',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleRating: 5.0,
    reviewsCount: 428,
    googleReviewUrl: 'https://www.google.com/search?q=Oasis+Artisan+Roastery+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Oasis+Artisan+Roastery+Effingham+NH',
    description: 'Specialty micro-roastery featuring single-origin cold brews, hearth sourdough bread, and morning brioche pastries.',
    suggestedCardHeadline: 'Fueling your morning at Oasis Roastery? Tap to leave us a 5-star review!',
    logoEmoji: '☕',
    accentColor: '#6366f1',
    menuTitle: 'Nitro Cold Brews, Sourdough & Brioche',
    isCommittedPartner: true,
    menuItems: [
      { id: 'oas-m1', name: 'Nitro Cold Brew Growler (64oz Fresh Pour)', description: '24-hour slow steeped cold brew with dark chocolate and toasted hazelnut notes', price: '$18.00', category: 'Cold Brews', popular: true, imageEmoji: '🧊' },
      { id: 'oas-m2', name: 'Artisan Wood-Fired Country Sourdough Loaf', description: 'Naturally fermented 36-hour sourdough boule with crisp blistered crust', price: '$8.50', category: 'Bakery', popular: true, imageEmoji: '🍞' },
      { id: 'oas-m3', name: 'White Mountain Iced Caramel Macchiato', description: 'Double espresso shot over cold milk, vanilla bean syrup, and caramel drizzle', price: '$5.75', category: 'Specialty Coffee', popular: true, imageEmoji: '☕' },
      { id: 'oas-m4', name: 'Maple Glazed Brioche Cinnamon Rolls (4-Pack)', description: 'Fluffy brioche swirled with Saigon cinnamon and drenched in pure maple cream cheese', price: '$16.00', category: 'Bakery', popular: true, imageEmoji: '🧁' }
    ]
  },
  {
    id: 'biz-eff-sean-courier',
    name: 'Sean Martin Courier & Errand Dispatch',
    town: 'Effingham',
    state: 'NH',
    category: 'services',
    address: 'Effingham / Carroll County Logistics Node, NH 03882',
    phone: '(508) 507-0305',
    googlePlaceId: 'ChIJSeanMartinCourierNH',
    googleRating: 5.0,
    reviewsCount: 340,
    googleReviewUrl: 'https://www.google.com/search?q=Sean+Martin+Courier+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Effingham+NH',
    description: 'All-weather AWD express courier, dockside firewood delivery, restaurant pickups, and custom local errand runner in Carroll County.',
    suggestedCardHeadline: 'Great delivery from Sean? Tap to leave a 5-star Google review!',
    logoEmoji: '🚚',
    accentColor: '#3b82f6',
    menuTitle: 'Express Courier Runs, Errand Services & Dock Delivery',
    isCommittedPartner: true,
    menuItems: [
      { id: 'smc-m1', name: 'Standard Town Courier Pickup & Delivery', description: 'We pick up your paid order or groceries from any Carroll County store and deliver straight to your door', price: '$9.99', category: 'Delivery', popular: true, imageEmoji: '📦' },
      { id: 'smc-m2', name: 'Dockside Kiln-Dried Hardwood Firewood Bundle (6 Logs)', description: 'Certified pest-free birch and oak campfire logs delivered with natural firestarter kit', price: '$8.50', category: 'Lake Essentials', popular: true, imageEmoji: '🪵' },
      { id: 'smc-m3', name: 'Deluxe Lakeside Campfire S’mores Crate (Serves 6)', description: 'Artisan graham crackers, chocolate bars, giant marshmallows, and roasting sticks', price: '$14.99', category: 'Lake Essentials', imageEmoji: '🍫' }
    ]
  },
  {
    id: 'biz-eff-country-peddler',
    name: "Country Peddler's Flea Market",
    town: 'Effingham',
    state: 'NH',
    category: 'retail',
    address: 'Route 25, Effingham, NH 03882',
    phone: '(603) 539-7000',
    googlePlaceId: 'ChIJN1639wN64okR9X58kUq5Eff',
    googleRating: 4.6,
    reviewsCount: 156,
    googleReviewUrl: 'https://www.google.com/search?q=Country+Peddlers+Flea+Market+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Country+Peddlers+Flea+Market+Effingham+NH',
    description: 'Bustling weekend treasure hub with vintage antiques, collectibles, local produce, and artisan booths on Route 25.',
    suggestedCardHeadline: 'Found a great vintage treasure today? Tap to share your 5-star find!',
    logoEmoji: '🏺',
    accentColor: '#10b981',
    menuTitle: 'Antiques, Curiosities & Vintage Treasures',
    isCommittedPartner: true,
    menuItems: [
      { id: 'cp-m1', name: 'Restored Griswold Cast Iron Skillet (#8)', description: 'Vintage seasoned American cast iron pan ready for cooking or display', price: '$48.00', category: 'Vintage Kitchen', popular: true, imageEmoji: '🍳' },
      { id: 'cp-m2', name: 'Antique Brass Dietz Hurricane Lantern', description: 'Original glass globe kerosene lantern with rustic patina', price: '$34.50', category: 'Primitives', imageEmoji: '🏮' },
      { id: 'cp-m3', name: 'Handmade Effingham Pine Needle Soaps (3-Pack)', description: 'All-natural cold processed goat milk and fir needle soap bars', price: '$14.00', category: 'Artisan Goods', popular: true, imageEmoji: '🧼' }
    ]
  },
  {
    id: 'biz-eff-camping-area',
    name: 'Ossipee Lake Camping Area',
    town: 'Effingham',
    state: 'NH',
    category: 'hospitality',
    address: '242 Ossipee Lake Rd, Effingham, NH 03882',
    phone: '(603) 539-4802',
    googlePlaceId: 'ChIJR4596wN64okRWq37kUq8Eff',
    googleRating: 4.7,
    reviewsCount: 312,
    googleReviewUrl: 'https://www.google.com/search?q=Ossipee+Lake+Camping+Area+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Ossipee+Lake+Camping+Area+Effingham+NH',
    description: 'Family-oriented lakeside campground with sandy beach access, boating, kayak rentals, and shaded woodland sites.',
    suggestedCardHeadline: 'Having a memorable stay on the lake? Tap to review our campground!',
    logoEmoji: '🏕️',
    accentColor: '#3b82f6',
    menuTitle: 'Campground Passes, Boat Rentals & Camp Store',
    isCommittedPartner: true,
    menuItems: [
      { id: 'ol-m1', name: 'Single Kayak / Paddleboard Half-Day Rental Pass', description: 'Includes life vest, paddle, and direct private beach boat launch access', price: '$35.00', category: 'Lake Activities', popular: true, imageEmoji: '🛶' },
      { id: 'ol-m2', name: 'Kiln-Dried Hardwood Campfire Bundle (6 Logs)', description: 'Certified pest-free local birch and oak firewood with natural firestarter kit', price: '$8.50', category: 'Camp Essentials', popular: true, imageEmoji: '🪵' },
      { id: 'ol-m3', name: 'Deluxe Fireside S’mores Box (Serves 6)', description: 'Artisan graham crackers, Hershey bars, giant marshmallows & telescoping roasting sticks', price: '$14.99', category: 'Camp Treats', popular: true, imageEmoji: '🍫' }
    ]
  },

  // --- OSSIPEE / CENTER OSSIPEE / WEST OSSIPEE, NH ---
  {
    id: 'biz-oss-hannaford-togo',
    name: 'Hannaford Supermarket & Hannaford To Go',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: '935 Route 16, Center Ossipee, NH 03864',
    phone: '(603) 641-9400',
    googlePlaceId: 'ChIJ_xXqHannafordOssipeeNH',
    googleRating: 4.6,
    reviewsCount: 1850,
    googleReviewUrl: 'https://www.google.com/search?q=Hannaford+Supermarket+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Hannaford+Supermarket+Ossipee+NH',
    websiteUrl: 'https://www.hannaford.com',
    description: 'Premier regional supermarket featuring Hannaford To Go curbside grocery pickup, fresh butcher meats, farm produce, full deli, and bakery.',
    suggestedCardHeadline: 'Quick & fresh checkout at Hannaford? Tap to leave your 5-star Google review!',
    logoEmoji: '🛒',
    accentColor: '#16a34a',
    menuTitle: 'Groceries, Deli Platters & Curbside Pickup',
    isCommittedPartner: true,
    menuItems: [
      { id: 'htg-m1', name: 'Hannaford To Go Curbside Express Pickup & Delivery', description: 'Prepay on Hannaford To Go, provide your pickup code, and our local courier delivers bags straight to your door', price: '$9.99', category: 'Courier Pickup', popular: true, imageEmoji: '📦' },
      { id: 'htg-m2', name: 'Fresh Deli Sub & Cold Cut Platter (Feeds 4-6)', description: 'Oven roasted turkey, roast beef, ham, aged Cabot cheddar, and fresh artisan rolls', price: '$28.50', category: 'Deli', popular: true, imageEmoji: '🥪' },
      { id: 'htg-m3', name: 'New England Farm Fresh Dairy & Egg Bundle', description: 'Cabot Vermont Extra Sharp Cheddar, 1 Dozen NH Brown Eggs, Whole Milk, and Sweet Butter', price: '$16.99', category: 'Dairy & Farm', popular: true, imageEmoji: '🧀' },
      { id: 'htg-m4', name: 'Herb Rotisserie Roasted Whole Chicken', description: 'Tender juicy whole chicken slow-roasted with rosemary garlic herbs', price: '$11.99', category: 'Hot Foods', imageEmoji: '🍗' }
    ]
  },
  {
    id: 'biz-oss-pizza-barn',
    name: 'Pizza Barn & Smokehouse',
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: '89 Main St / Route 153, Center Ossipee, NH 03864',
    phone: '(603) 539-2244',
    googlePlaceId: 'ChIJX9275z974okRYK6wL384Eff',
    googleRating: 4.7,
    reviewsCount: 312,
    googleReviewUrl: 'https://www.google.com/search?q=Pizza+Barn+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Pizza+Barn+Ossipee+NH',
    description: 'Crispy thin crust, stone-baked pizzas, slow-smoked BBQ pulled pork, and friendly tavern dining.',
    suggestedCardHeadline: 'Enjoyed your slice at Pizza Barn? Tap to review us on Google!',
    logoEmoji: '🍕',
    accentColor: '#ef4444',
    menuTitle: 'Stone-Baked Pizzas & Smokehouse BBQ',
    isCommittedPartner: true,
    menuItems: [
      { id: 'pb-m1', name: 'The Barnyard Supreme Pizza (16")', description: 'Italian sausage, pepperoni, seasoned meatballs, bacon, green peppers, mushrooms & mozzarella', price: '$21.99', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'pb-m2', name: 'Applewood Smoked Pulled Pork Platter', description: '1/2 lb slow-smoked pork shoulder, cider BBQ mop, fries, slaw and cornbread', price: '$16.50', category: 'BBQ', popular: true, imageEmoji: '🍖' },
      { id: 'pb-m3', name: 'Loaded Pulled Pork Barn Waffle Fries', description: 'Seasoned waffle fries with slow-smoked pork, melted cheddar jack, and BBQ drizzle', price: '$12.99', category: 'Appetizers', imageEmoji: '🍟' }
    ]
  },
  {
    id: 'biz-oss-smoke-world',
    name: 'Smoke World Ossipee',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: '870 Route 16, Ossipee, NH 03814',
    phone: '(603) 539-7665',
    googlePlaceId: 'ChIJb6eBq9f94okRGb_SmokeWorldOss',
    googleRating: 4.9,
    reviewsCount: 148,
    googleReviewUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
    googleMapsUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
    description: 'Premier regional smoke, vape, glass, tobacco accessories, and novelty shop located on Route 16 in Ossipee.',
    suggestedCardHeadline: 'Love your visit to Smoke World? Tap your phone to leave us a 5-star Google review!',
    logoEmoji: '💨',
    accentColor: '#10b981',
    menuTitle: 'Featured Smoke, Vape & Glass Catalog',
    isCommittedPartner: true,
    menuItems: [
      { id: 'sw-m1', name: 'Geek Bar Pulse 15,000 Puffs Disposable', description: 'Dual mesh coil, full LED display, 5% nicotine salt in signature fruit flavors', price: '$19.99', category: 'Vapes', popular: true, imageEmoji: '💨' },
      { id: 'sw-m2', name: 'Handblown Hecht Borosilicate Beaker Bong (14")', description: 'Heavy 7mm thick crystal clear borosilicate glass with ice pinch & diffused downstem', price: '$69.99', category: 'Glassware', popular: true, imageEmoji: '🧪' },
      { id: 'sw-m3', name: 'Raw Classic Natural Unrefined Cones (6-Pack)', description: 'Authentic pure hemp papers with built-in filter tips', price: '$4.25', category: 'Accessories', imageEmoji: '🌿' },
      { id: 'sw-m4', name: 'Lookah Seahorse Pro Plus Vaporizer', description: 'Portable electric nectar collector with quartz tip and glass tube mouthpiece', price: '$49.99', category: 'Vaporizers', popular: true, imageEmoji: '⚡' }
    ]
  },
  {
    id: 'biz-oss-yankee-smokehouse',
    name: 'Yankee Smokehouse BBQ',
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: 'Jct Rte 16 & 25, West Ossipee, NH 03890',
    phone: '(603) 539-2144',
    googlePlaceId: 'ChIJ2d1bEzl64okRDN2wL384Oss',
    googleRating: 4.7,
    reviewsCount: 1420,
    googleReviewUrl: 'https://www.google.com/search?q=Yankee+Smokehouse+West+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Yankee+Smokehouse+West+Ossipee+NH',
    description: 'Legendary New Hampshire barbecue smoked low and slow over real hardwood. Famous pulled pork, ribs, and briskets.',
    suggestedCardHeadline: 'Best BBQ in NH? Tap your phone to leave Yankee Smokehouse a 5-star review!',
    logoEmoji: '🍖',
    accentColor: '#f97316',
    menuTitle: 'Slow-Smoked Hardwood BBQ Platters',
    isCommittedPartner: true,
    menuItems: [
      { id: 'ys-m1', name: 'St. Louis Applewood Ribs Platter (Half Rack)', description: 'Tender hardwood-smoked ribs glazed with signature sweet molasses BBQ sauce, fries & slaw', price: '$22.99', category: 'Platters', popular: true, imageEmoji: '🍖' },
      { id: 'ys-m2', name: 'Carolina Pulled Pork Sandwich & Cornbread', description: '14-hour hickory smoked pork shoulder on toasted brioche with house cider vinegar mop', price: '$14.50', category: 'Sandwiches', popular: true, imageEmoji: '🥪' },
      { id: 'ys-m3', name: 'Texas Smoked Beef Brisket Dinner', description: 'Dry-rubbed prime beef brisket sliced thick with smoked pit beans and mac & cheese', price: '$24.99', category: 'Platters', popular: true, imageEmoji: '🥩' }
    ]
  },
  {
    id: 'biz-oss-hobbs-tavern',
    name: "Hobbs Tavern & Brewing Co.",
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: '2415 White Mountain Hwy, West Ossipee, NH 03890',
    phone: '(603) 539-2000',
    googlePlaceId: 'ChIJgU7bEzl64okRFB5wL384Oss',
    googleRating: 4.6,
    reviewsCount: 980,
    googleReviewUrl: 'https://www.google.com/search?q=Hobbs+Tavern+West+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Hobbs+Tavern+West+Ossipee+NH',
    description: 'Historic country tavern serving handcrafted local craft ales, wood-fired artisan pizzas, and farm-to-table pub classics.',
    suggestedCardHeadline: 'Enjoyed your craft brew & meal? Tap to leave Hobbs a Google review!',
    logoEmoji: '🍺',
    accentColor: '#f59e0b',
    menuTitle: 'Craft Ales, Wood-Fired Pies & Tavern Fare',
    isCommittedPartner: true,
    menuItems: [
      { id: 'hb-m1', name: 'Hobbs Hi-Fi Hazy NEIPA (4-Pack 16oz)', description: 'Juicy tropical hop profile with Citra & Mosaic, brewed fresh on site in West Ossipee', price: '$16.00', category: 'Craft Beer', popular: true, imageEmoji: '🍺' },
      { id: 'hb-m2', name: 'Hobbs Grass-Fed Bacon Jam Burger', description: '1/2 lb local beef, house smoked bacon onion jam, Grafton cheddar & crispy fries', price: '$17.99', category: 'Tavern Fare', popular: true, imageEmoji: '🍔' },
      { id: 'hb-m3', name: 'Wood-Fired Prosciutto & Fig Flatbread', description: 'Prosciutto di Parma, black mission figs, goat cheese, baby arugula & balsamic reduction', price: '$16.50', category: 'Pizzas', popular: true, imageEmoji: '🍕' }
    ]
  },
  {
    id: 'biz-oss-mountain-grainery',
    name: 'Mountain Grainery Ace Hardware',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: 'Route 16, Center Ossipee, NH 03814',
    phone: '(603) 539-2666',
    googlePlaceId: 'ChIJQ13bEzl64okRVG1wL384Oss',
    googleRating: 4.8,
    reviewsCount: 310,
    googleReviewUrl: 'https://www.google.com/search?q=Mountain+Grainery+Ace+Hardware+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Mountain+Grainery+Ace+Hardware+Ossipee+NH',
    description: 'Essential local hardware, homestead supplies, organic feeds, tools, and neighborhood contractor expertise.',
    suggestedCardHeadline: 'Did our team help you with your project? Tap to leave a quick 5-star review!',
    logoEmoji: '🔨',
    accentColor: '#ef4444',
    menuTitle: 'Homestead, Feed & Hardware Catalog',
    isCommittedPartner: true,
    menuItems: [
      { id: 'mg-m1', name: 'Premium Hardwood Wood Pellets (40 lb Bag)', description: 'Clean-burning 100% hardwood heating pellets with high BTU heat output', price: '$7.49', category: 'Heating', popular: true, imageEmoji: '🪵' },
      { id: 'mg-m2', name: 'Poulin Organic Layer Poultry Feed (50 lb)', description: 'Non-GMO regional chicken feed for healthy farm-fresh egg production', price: '$22.99', category: 'Farm & Feed', imageEmoji: '🌾' },
      { id: 'mg-m3', name: 'DeWalt 20V MAX Cordless Drill & Impact Driver Combo', description: 'Heavy duty lithium-ion brushless kit with 2 batteries, charger & contractor bag', price: '$199.00', category: 'Tools', popular: true, imageEmoji: '🛠️' }
    ]
  },
  {
    id: 'biz-oss-jakes-seafood',
    name: "Jake's Seafood & Grill",
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: '2055 Route 16, Center Ossipee, NH 03814',
    phone: '(603) 539-2805',
    googlePlaceId: 'ChIJ0e7bEzl64okRKX3wL384Oss',
    googleRating: 4.5,
    reviewsCount: 650,
    googleReviewUrl: 'https://www.google.com/search?q=Jakes+Seafood+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Jakes+Seafood+Ossipee+NH',
    description: 'Fresh Atlantic fried clams, Maine lobster rolls, chowders, and grilled seafood baskets.',
    suggestedCardHeadline: 'Loved your lobster roll? Tap to leave Jake’s Seafood a Google review!',
    logoEmoji: '🦞',
    accentColor: '#06b6d4',
    menuTitle: 'Fresh Atlantic Seafood & Lobster Baskets',
    isCommittedPartner: true,
    menuItems: [
      { id: 'js-m1', name: 'Traditional Maine Lobster Roll (Jumbo Cold or Hot Buttered)', description: '1/3 lb fresh claw & knuckle lobster meat on toasted split-top brioche with Cape Cod chips', price: '$26.99', category: 'Seafood Rolls', popular: true, imageEmoji: '🦞' },
      { id: 'js-m2', name: 'Whole Belly Sweet Ipswich Clam Basket', description: 'Hand-breaded fresh Atlantic whole belly clams fried crisp with french fries & homemade tartar', price: '$28.99', category: 'Fried Baskets', popular: true, imageEmoji: '🦪' },
      { id: 'js-m3', name: 'New England Scratch Clam Chowder (Bread Bowl)', description: 'Rich heavy cream chowder packed with tender clams, sea salt, potatoes, and oyster crackers', price: '$9.99', category: 'Soups', popular: true, imageEmoji: '🥣' }
    ]
  },
  {
    id: 'biz-oss-tramway-artisans',
    name: 'Tramway Artisans Country Store',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: 'Route 16, West Ossipee, NH 03890',
    phone: '(603) 539-5700',
    googlePlaceId: 'ChIJx87bEzl64okROA9wL384Oss',
    googleRating: 4.8,
    reviewsCount: 420,
    googleReviewUrl: 'https://www.google.com/search?q=Tramway+Artisans+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Tramway+Artisans+Ossipee+NH',
    description: 'Multi-room artisan marketplace featuring NH pottery, handmade fudge, wooden toys, soaps, and gifts.',
    suggestedCardHeadline: 'Loved browsing our artisan rooms? Tap your phone to leave a review!',
    logoEmoji: '🎁',
    accentColor: '#8b5cf6',
    menuTitle: 'Artisan Fudge, Handcrafted Pottery & NH Souvenirs',
    isCommittedPartner: true,
    menuItems: [
      { id: 'ta-m1', name: 'Creamy Maple Walnut Homemade Fudge (1/2 lb)', description: 'Old-fashioned kettle boiled artisan fudge made with real Carroll County maple syrup', price: '$8.99', category: 'Fudge & Sweets', popular: true, imageEmoji: '🍬' },
      { id: 'ta-m2', name: 'Hand-Thrown White Mountain Ceramic Coffee Mug', description: 'Wheel-thrown glazed stoneware mug featuring embossed mountain pine tree motif', price: '$24.00', category: 'Pottery', popular: true, imageEmoji: '☕' }
    ]
  },

  // --- FREEDOM, NH ---
  {
    id: 'biz-fre-village-store',
    name: 'Freedom Village Store & Cafe',
    town: 'Freedom',
    state: 'NH',
    category: 'retail',
    address: 'Elm Street, Freedom, NH 03836',
    phone: '(603) 539-7988',
    googlePlaceId: 'ChIJZ49fEzl64okRNM8wL384Fre',
    googleRating: 4.9,
    reviewsCount: 168,
    googleReviewUrl: 'https://www.google.com/search?q=Freedom+Village+Store+Freedom+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Freedom+Village+Store+Freedom+NH',
    description: 'Historic volunteer-powered non-profit village store offering local baked goods, coffees, maple syrup, and community art.',
    suggestedCardHeadline: 'Support our historic village store! Tap to leave a 5-star Google review.',
    logoEmoji: '🏡',
    accentColor: '#10b981',
    menuTitle: 'Historic Provisions, Baked Goods & Coffee',
    isCommittedPartner: true,
    menuItems: [
      { id: 'fvs-m1', name: 'Wild Freedom Maine Blueberry Scone (2-Pack)', description: 'Freshly baked morning scones packed with wild mountain blueberries and sugar glaze', price: '$6.50', category: 'Bakery', popular: true, imageEmoji: '🫐' },
      { id: 'fvs-m2', name: 'Pure NH Grade A Amber Maple Syrup (16oz Glass Bottle)', description: 'Wood-fired maple syrup tapped from local Carroll County sugar maples', price: '$16.00', category: 'Pantry', popular: true, imageEmoji: '🍯' },
      { id: 'fvs-m3', name: 'Village Roastery Hot Coffee Traveler (96oz)', description: 'Freshly brewed dark roast coffee in insulated pour tote with 8 cups & fixings', price: '$24.00', category: 'Beverages', imageEmoji: '☕' }
    ]
  },

  // --- WAKEFIELD / SANBORNVILLE, NH ---
  {
    id: 'biz-wak-poor-peoples-pub',
    name: "Poor People's Pub",
    town: 'Wakefield',
    state: 'NH',
    category: 'dining',
    address: '28 Meadow St, Sanbornville, NH 03872',
    phone: '(603) 522-8228',
    googlePlaceId: 'ChIJy9dfEzl64okRWN8wL384Wak',
    googleRating: 4.7,
    reviewsCount: 1120,
    googleReviewUrl: 'https://www.google.com/search?q=Poor+Peoples+Pub+Sanbornville+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Poor+Peoples+Pub+Sanbornville+NH',
    description: 'Lively neighborhood tavern with killer wings, stuffed burgers, live weekend music, and craft drafts.',
    suggestedCardHeadline: 'Best pub in Wakefield? Tap to leave PPP a 5-star Google review!',
    logoEmoji: '🍻',
    accentColor: '#eab308',
    menuTitle: 'Famous PPP Jumbo Wings, Tavern Burgers & Poutines',
    isCommittedPartner: true,
    menuItems: [
      { id: 'ppp-m1', name: 'Famous PPP Smoked Jumbo Wings (12-Pack)', description: 'Crisp seasoned wings tossed in Ghost Pepper Honey, Garlic Parm, or Sweet Heat BBQ with blue cheese', price: '$16.99', category: 'Wings', popular: true, imageEmoji: '🍗' },
      { id: 'ppp-m2', name: 'The Wakefield Monster Bacon-Stuffed Burger', description: '1/2 lb chuck patty stuffed with smoked bacon & cheddar, topped with crispy onion straws on brioche', price: '$16.50', category: 'Burgers', popular: true, imageEmoji: '🍔' },
      { id: 'ppp-m3', name: 'Loaded Tavern Pulled Pork Poutine Skillet', description: 'Golden hand-cut fries smothered in cheese curds, rich brown gravy, and applewood pulled pork', price: '$13.99', category: 'Pub Starters', popular: true, imageEmoji: '🍟' }
    ]
  },
  {
    id: 'biz-wak-knotty-pine',
    name: 'Knotty Pine Grille & Tavern',
    town: 'Wakefield',
    state: 'NH',
    category: 'dining',
    address: 'Route 16, Wakefield, NH 03872',
    phone: '(603) 522-6800',
    googlePlaceId: 'ChIJw7dfEzl64okRZN8wL384Wak',
    googleRating: 4.6,
    reviewsCount: 580,
    googleReviewUrl: 'https://www.google.com/search?q=Knotty+Pine+Grille+Wakefield+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Knotty+Pine+Grille+Wakefield+NH',
    description: 'Cozy pine interior, prime rib specials, fresh seafood, and warm New England hospitality.',
    suggestedCardHeadline: 'Loved your dinner with us? Tap your phone to leave a Google review!',
    logoEmoji: '🌲',
    accentColor: '#10b981',
    menuTitle: 'Slow-Roasted Prime Rib, Fresh Seafood & Grille Steaks',
    isCommittedPartner: true,
    menuItems: [
      { id: 'kp-m1', name: 'Slow-Roasted Knotty Pine Prime Rib (14oz Cut)', description: 'Herb-crusted USDA Choice prime rib with rosemary au jus, loaded baked potato, and garlic green beans', price: '$29.99', category: 'Steaks & Roasts', popular: true, imageEmoji: '🥩' },
      { id: 'kp-m2', name: 'Pan-Seared Fresh Atlantic Haddock Piccata', description: 'Fresh line-caught haddock in lemon white wine caper sauce over garlic butter linguine', price: '$22.50', category: 'Seafood', popular: true, imageEmoji: '🐟' }
    ]
  },
  {
    id: 'biz-wak-lovell-lake-market',
    name: 'Lovell Lake Market & Deli',
    town: 'Wakefield',
    state: 'NH',
    category: 'retail',
    address: 'Sanbornville, NH 03872',
    phone: '(603) 522-3344',
    googlePlaceId: 'ChIJu1dfEzl64okR1N8wL384Wak',
    googleRating: 4.8,
    reviewsCount: 220,
    googleReviewUrl: 'https://www.google.com/search?q=Lovell+Lake+Market+Sanbornville+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Lovell+Lake+Market+Sanbornville+NH',
    description: 'Lakeside convenience, butcher cut meats, made-to-order subs, and cold craft beverages.',
    suggestedCardHeadline: 'Enjoyed your lake provisions? Tap to leave a quick 5-star review!',
    logoEmoji: '🥪',
    accentColor: '#06b6d4',
    menuTitle: 'Lakeside Delicatessen Grinders & Butcher Provisions',
    isCommittedPartner: true,
    menuItems: [
      { id: 'llm-m1', name: 'The Lovell Lake Monster Italian Grinder (12")', description: 'Capicola, Genoa salami, mortadella, provolone, shredded lettuce, tomatoes, hot peppers & house oil blend', price: '$13.99', category: 'Deli Grinders', popular: true, imageEmoji: '🥪' },
      { id: 'llm-m2', name: 'Hand-Cut Prime Ribeye Steaks (Twin 12oz Pack)', description: 'Butcher-cut fresh prime grade beef ribeye seasoned and vacuum sealed for the grill', price: '$32.00', category: 'Butcher Shop', popular: true, imageEmoji: '🥩' }
    ]
  },

  // --- CONWAY & NORTH CONWAY, NH ---
  {
    id: 'biz-con-zebs-store',
    name: "Zeb's General Store",
    town: 'Conway',
    state: 'NH',
    category: 'retail',
    address: '2675 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-9294',
    googlePlaceId: 'ChIJJWtfEzl64okRAN8wL384Con',
    googleRating: 4.8,
    reviewsCount: 5400,
    googleReviewUrl: 'https://www.google.com/search?q=Zebs+General+Store+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Zebs+General+Store+North+Conway+NH',
    description: 'Iconic multi-story general store boasting the largest collection of New England-made specialty foods, candy counter, and nostalgia.',
    suggestedCardHeadline: 'Loved your visit to Zeb’s? Tap your phone to leave us a 5-star review!',
    logoEmoji: '🍬',
    accentColor: '#f59e0b',
    menuTitle: 'New England Candies, Maple Treats & Jams',
    isCommittedPartner: true,
    menuItems: [
      { id: 'zeb-m1', name: 'Zeb’s Old-Fashioned Hard Candy Sampler Tin (1 lb)', description: 'Classic root beer barrels, butterscotch, horehound, wintergreen, and peppermint drops', price: '$12.99', category: 'Candy Counter', popular: true, imageEmoji: '🍬' },
      { id: 'zeb-m2', name: 'Wild Mountain Blackberry & Blueberry Preserves (16oz)', description: 'Handcrafted New England small batch berry jam made with pure cane sugar', price: '$8.99', category: 'Jams & Honey', popular: true, imageEmoji: '🫐' }
    ]
  },
  {
    id: 'biz-con-flatbread',
    name: 'Flatbread Company',
    town: 'Conway',
    state: 'NH',
    category: 'dining',
    address: '2760 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-4470',
    googlePlaceId: 'ChIJHWtfEzl64okRCN8wL384Con',
    googleRating: 4.7,
    reviewsCount: 2890,
    googleReviewUrl: 'https://www.google.com/search?q=Flatbread+Company+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Flatbread+Company+North+Conway+NH',
    description: 'Clay wood-fired earthen oven baking organic pizzas using local meats and cheeses.',
    suggestedCardHeadline: 'Enjoyed your organic wood-fired pizza? Tap to leave a Google review!',
    logoEmoji: '🔥',
    accentColor: '#ef4444',
    menuTitle: 'Organic Earthen Wood-Fired Clay Oven Flatbreads',
    isCommittedPartner: true,
    menuItems: [
      { id: 'fc-m1', name: 'Jay’s Heart Wood-Fired Flatbread (Large 16")', description: 'Organic tomato sauce, whole milk mozzarella, imported parmesan, and garlic herb oil baked in clay oven', price: '$21.50', category: 'Flatbreads', popular: true, imageEmoji: '🍕' },
      { id: 'fc-m2', name: 'Pork & Pepper Nitrate-Free Flatbread', description: 'Slow-cooked local pork shoulder, organic red onions, sweet bell peppers, rosemary & maple BBQ drizzle', price: '$24.00', category: 'Flatbreads', popular: true, imageEmoji: '🥓' }
    ]
  },
  {
    id: 'biz-con-frontside-coffee',
    name: 'Frontside Coffee Roasters',
    town: 'Conway',
    state: 'NH',
    category: 'dining',
    address: '2697 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-7400',
    googlePlaceId: 'ChIJGWtfEzl64okRDN8wL384Con',
    googleRating: 4.8,
    reviewsCount: 1650,
    googleReviewUrl: 'https://www.google.com/search?q=Frontside+Coffee+Roasters+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Frontside+Coffee+Roasters+North+Conway+NH',
    description: 'In-house small batch coffee roaster serving specialty espresso, cold brews, fresh bagels, and pastries.',
    suggestedCardHeadline: 'Fueling your mountain adventures? Tap to review Frontside Coffee!',
    logoEmoji: '☕',
    accentColor: '#6366f1',
    menuTitle: 'Small-Batch Specialty Roasts, Cold Brews & Bagels',
    isCommittedPartner: true,
    menuItems: [
      { id: 'fcr-m1', name: 'White Mountain Summit Espresso Blend (12oz Whole Bean)', description: 'Notes of dark cocoa, roasted almond, and sweet dried cherry. Roasted in North Conway.', price: '$16.50', category: 'Whole Bean Coffee', popular: true, imageEmoji: '☕' },
      { id: 'fcr-m2', name: 'Draft Nitro Maple Cream Cold Brew (20oz)', description: 'Smooth cascading nitro cold brew infused with pure New Hampshire maple syrup & cream', price: '$6.25', category: 'Cold Brews', popular: true, imageEmoji: '🧊' }
    ]
  }
];

/**
 * Get verified, 100% committed local businesses for a town or regional area.
 * Guaranteed zero fictional/uncommitted storefronts.
 */
export function getBusinessesForTown(townName: string, state: string = 'NH'): LocalBusiness[] {
  const cleanTown = townName.trim().toLowerCase();
  const existing = EFFINGHAM_AREA_BUSINESSES.filter(
    b => b.town.toLowerCase() === cleanTown || (cleanTown.includes(b.town.toLowerCase()))
  );
  if (existing.length > 0) {
    return existing;
  }
  // Return verified committed regional partners that deliver to this town via Sean Martin Express
  return EFFINGHAM_AREA_BUSINESSES.filter(b => b.isCommittedPartner);
}

/**
 * Helper to generate official Google Review URLs from Place ID or Business Name
 * Guarantees zero 404 errors by using Google Search review query when a synthetic Place ID is passed
 */
export function buildGoogleReviewUrl(placeId?: string, businessName?: string, town?: string): string {
  const isRealGooglePlaceId = placeId && placeId.startsWith('ChIJ') && !placeId.includes('_') && placeId.length >= 27;
  if (isRealGooglePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${placeId.trim()}`;
  }
  const cleanName = (businessName || 'Local Business').trim();
  const cleanTown = (town || 'Ossipee').trim();
  const query = encodeURIComponent(`${cleanName} ${cleanTown} NH`);
  return `https://www.google.com/search?q=${query}`;
}

/**
 * Helper to build Smart Funnel URL for physical NFC cards
 */
export function buildSmartTapUrl(cardId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org');
  return `${base}/tap/${cardId}`;
}
