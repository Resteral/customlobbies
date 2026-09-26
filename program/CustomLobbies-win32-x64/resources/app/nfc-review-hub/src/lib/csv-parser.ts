/**
 * CSV Parser & Smart Column Mapper Utility for Townraise
 * Handles RFC 4180 CSV parsing, delimiter auto-detection, and flexible header mapping.
 */

export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
  delimiter: string;
}

/**
 * Parses raw CSV / TSV text into headers and an array of key-value row records.
 * Supports quoted fields, multiline cells, and auto-detects commas, tabs, or semicolons.
 */
export function parseCsvText(rawText: string): CsvParseResult {
  const errors: string[] = [];
  if (!rawText || !rawText.trim()) {
    return { headers: [], rows: [], errors: ['CSV content is empty'], delimiter: ',' };
  }

  // Detect delimiter based on first line
  const firstLine = rawText.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = ',';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';
  else if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';

  // State-machine token parser
  const parsedRows: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    const nextChar = rawText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentToken.trim());
      currentToken = '';
      if (currentRow.some(cell => cell.length > 0)) {
        parsedRows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentToken += char;
    }
  }

  // Push remaining token
  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      parsedRows.push(currentRow);
    }
  }

  if (parsedRows.length === 0) {
    return { headers: [], rows: [], errors: ['No valid rows detected in CSV'], delimiter };
  }

  const rawHeaders = parsedRows[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const dataRows = parsedRows.slice(1);

  const rowObjects: Record<string, string>[] = [];

  dataRows.forEach((row, rowIndex) => {
    // Skip empty lines
    if (row.length === 1 && !row[0]) return;

    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, colIndex) => {
      rowObj[header] = row[colIndex] || '';
    });
    rowObjects.push(rowObj);
  });

  return {
    headers: rawHeaders,
    rows: rowObjects,
    errors,
    delimiter,
  };
}

/**
 * Smart field mappings for Businesses & Restaurants
 */
export const BUSINESS_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'business name', 'restaurant', 'restaurant name', 'shop name', 'title', 'company', 'store name', 'place'],
  category: ['category', 'category label', 'type', 'industry', 'cuisine', 'business type', 'sector'],
  town: ['town', 'town node', 'city', 'municipality', 'village', 'location'],
  address: ['address', 'street', 'street address', 'location address', 'road'],
  phone: ['phone', 'telephone', 'phone number', 'tel', 'cell', 'mobile', 'dispatch phone'],
  website: ['website', 'url', 'web', 'link', 'site', 'website url'],
  googleRating: ['rating', 'google rating', 'stars', 'google stars', 'score'],
  reviewCount: ['reviews', 'review count', 'total reviews', 'reviews count', 'num reviews'],
  description: ['description', 'about', 'bio', 'summary', 'details', 'notes', 'tagline'],
  verified: ['verified', 'is verified', 'verified badge', 'claim status', 'claimed'],
};

/**
 * Smart field mappings for Menu & Storefront Products
 */
export const PRODUCT_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'item name', 'product name', 'dish', 'dish name', 'title', 'item'],
  price: ['price', 'cost', 'amount', 'item price', 'rate', 'retail price', 'fee'],
  category: ['category', 'section', 'menu category', 'type', 'group', 'tag'],
  description: ['description', 'details', 'ingredients', 'item description', 'summary', 'bio'],
  imageUrl: ['image', 'image url', 'photo', 'picture', 'photo url', 'thumbnail', 'pic'],
  badge: ['badge', 'tag', 'highlight', 'special', 'featured', 'promo', 'label'],
  calories: ['calories', 'cal', 'energy', 'kcal'],
  dietaryTags: ['dietary', 'dietary tags', 'allergens', 'diet', 'vegan/gf', 'tags'],
  inStock: ['in stock', 'stock', 'available', 'active', 'status', 'is available'],
};

/**
 * Smart field mappings for Marketplace Artisan Products
 */
export const MARKETPLACE_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'product name', 'title', 'item title', 'goods'],
  price: ['price', 'cost', 'retail price', 'amount', 'msrp'],
  category: ['category', 'department', 'type', 'product type'],
  subtitle: ['subtitle', 'short desc', 'brief', 'tagline'],
  description: ['description', 'story', 'details', 'material info'],
  town: ['town', 'town node', 'origin town', 'crafted in', 'city'],
  sellerName: ['seller', 'seller name', 'artisan', 'maker', 'vendor', 'shop'],
  imageUrl: ['image', 'image url', 'photo', 'picture'],
  badge: ['badge', 'ribbon', 'highlight', 'tag'],
  rating: ['rating', 'stars', 'score'],
  inStock: ['in stock', 'inventory', 'available'],
};

/**
 * Automatically suggests best header mappings
 */
export function autoMapHeaders(headers: string[], synonymsMap: Record<string, string[]>): Record<string, string> {
  const mapping: Record<string, string> = {};

  Object.keys(synonymsMap).forEach(targetKey => {
    const synonyms = synonymsMap[targetKey];
    const match = headers.find(h => {
      const cleanH = h.toLowerCase().trim().replace(/[_-]/g, ' ');
      return synonyms.some(syn => cleanH === syn || cleanH.includes(syn));
    });

    if (match) {
      mapping[targetKey] = match;
    }
  });

  return mapping;
}

/**
 * Converts an array of objects into a downloadable CSV string
 */
export function generateCsvString(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row => {
    return headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
      // Escape quotes and wrap in quotes if contains comma, newline or quotes
      if (val.includes('"') || val.includes(',') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a direct browser file download for a CSV string
 */
export function downloadCsvFile(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// DATAFINITI & MENUS API JSON INGESTION ENGINE
// ============================================================================

export interface ParsedApiMenuItem {
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  calories?: string;
  dietaryTags?: string[];
  dateObserved?: string;
}

export interface ParsedRestaurantPayload {
  restaurantName: string;
  category?: string;
  town?: string;
  state?: string;
  address?: string;
  phone?: string;
  website?: string;
  dishes: ParsedApiMenuItem[];
  rawSource: 'datafiniti' | 'menus_api' | 'universal_json';
}

export const SAMPLE_DATAFINITI_JSON = JSON.stringify({
  id: "AVwc4V0rkufWRAb533Jk",
  name: "Ossipee Mountain Smokehouse & Tavern",
  address: "410 Route 16",
  city: "Center Ossipee",
  province: "NH",
  postalCode: "03814",
  phoneNumbers: ["(603) 539-8800"],
  websites: ["https://ossipeemountainsmokehouse.local"],
  categories: ["Barbecue Restaurant", "American Restaurant", "Tavern"],
  menus: [
    {
      name: "Applewood Smoked Pork Ribs (Full Rack)",
      amount: 26.95,
      currency: "USD",
      categories: ["Pitmaster BBQ Platters"],
      description: "Dry rubbed with brown sugar & spices, smoked 6 hours over local applewood. Served with pit beans, cider slaw, and jalapeño cornbread.",
      dateSeen: ["2026-08-15T00:00:00Z"]
    },
    {
      name: "Slow Smoked Texas Beef Brisket Platter",
      amount: 24.50,
      currency: "USD",
      categories: ["Pitmaster BBQ Platters"],
      description: "Prime beef brisket smoked low and slow over hickory for 14 hours. Sliced thick with house sweet mop BBQ sauce.",
      dateSeen: ["2026-08-15T00:00:00Z"]
    },
    {
      name: "Crispy Smokehouse Bacon Burger",
      amount: 15.99,
      currency: "USD",
      categories: ["Burgers & Sandwiches"],
      description: "Half-pound Angus beef patty topped with smoked pulled pork, crispy bacon strips, cheddar jack cheese, and crispy onion straws.",
      dateSeen: ["2026-08-15T00:00:00Z"]
    },
    {
      name: "4-Cheese Skillet Mac & Cheese with Pulled Pork",
      amount: 14.50,
      currency: "USD",
      categories: ["Appetizers & Sides"],
      description: "Cavatappi pasta baked in sharp Grafton cheddar, smoked gouda, mozzarella, topped with applewood pulled pork and toasted breadcrumbs.",
      dateSeen: ["2026-08-15T00:00:00Z"]
    },
    {
      name: "Cast Iron Campfire S'mores Brownie",
      amount: 8.50,
      currency: "USD",
      categories: ["Desserts"],
      description: "Warm fudge brownie baked in a cast-iron skillet with toasted campfire marshmallows, graham cracker dust, and vanilla bean ice cream.",
      dateSeen: ["2026-08-15T00:00:00Z"]
    }
  ]
}, null, 2);

export const SAMPLE_MENUS_API_JSON = JSON.stringify({
  status: "success",
  scraper_type: "website_and_pdf",
  restaurant_name: "Freedom Village Cafe & Roastery",
  address: "12 Elm Street, Freedom, NH 03836",
  phone: "(603) 539-7988",
  website: "https://freedomvillagecafe.local",
  currency: "USD",
  menu: {
    sections: [
      {
        name: "Morning Bakery & Breakfast",
        items: [
          {
            name: "Wild Maine Blueberry Crumb Scone (2-Pack)",
            price: 6.50,
            description: "Scratch-baked fresh daily with wild hand-picked Maine blueberries and crystal turbinado sugar crust.",
            dietary_tags: ["Vegetarian", "Scratch Baked"],
            image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
          },
          {
            name: "Country Sunrise Egg & Grafton Cheddar Croissant",
            price: 8.99,
            description: "Two local farm eggs, thick-cut applewood bacon, and melted Grafton VT sharp cheddar on a flaky butter croissant.",
            dietary_tags: ["Chef Special"],
            image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600"
          }
        ]
      },
      {
        name: "Artisan Sandwiches & Paninis",
        items: [
          {
            name: "Roasted Turkey & Cranberry Orange Panini",
            price: 13.50,
            description: "Herb-roasted sliced turkey breast, house cranberry orange relish, and melted provolone pressed on sourdough.",
            dietary_tags: ["Local Favorite"],
            image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600"
          },
          {
            name: "White Mountain Honey Mustard Chicken Salad Wrap",
            price: 12.99,
            description: "Tender chicken breast tossed with diced crisp apples, toasted walnuts, and fresh romaine in a honey wheat wrap.",
            dietary_tags: ["Healthy Option"],
            image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600"
          }
        ]
      },
      {
        name: "Artisan Coffee & Drinks",
        items: [
          {
            name: "Carroll County Pure Maple Iced Latte (16oz)",
            price: 5.75,
            description: "Double shot of espresso, whole milk, and single-origin dark amber maple syrup over cold ice.",
            dietary_tags: ["Gluten-Free"],
            image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600"
          }
        ]
      }
    ]
  }
}, null, 2);

/**
 * Parses a Datafiniti restaurant object or array of objects
 */
export function parseDatafinitiJson(parsedObj: any): ParsedRestaurantPayload {
  const root = Array.isArray(parsedObj) ? parsedObj[0] : (parsedObj.data ? parsedObj.data[0] : parsedObj);
  
  const restaurantName = root.name || root.businessName || 'Extracted Restaurant';
  const town = root.city || root.town || 'Effingham';
  const state = root.province || root.state || 'NH';
  const address = root.address ? `${root.address}${root.city ? `, ${root.city}` : ''}` : '';
  const phone = (root.phoneNumbers && root.phoneNumbers[0]) || (root.phones && root.phones[0]) || root.phone || '';
  const website = (root.websites && root.websites[0]) || root.website || '';
  const category = (root.categories && root.categories[0]) || 'dining_bars';

  const rawMenus = root.menus || root.menu || [];
  const dishes: ParsedApiMenuItem[] = [];

  rawMenus.forEach((item: any) => {
    if (!item.name) return;
    const priceVal = parseFloat(String(item.amount || item.amountMin || item.price || item.cost || 0));
    const catName = Array.isArray(item.categories) 
      ? item.categories[0] 
      : (typeof item.categories === 'string' ? item.categories : 'Mains');

    dishes.push({
      name: String(item.name).trim(),
      price: isNaN(priceVal) ? 9.99 : priceVal,
      category: catName || 'Mains',
      description: item.description || '',
      dateObserved: item.dateSeen && item.dateSeen[0] ? item.dateSeen[0] : undefined
    });
  });

  return {
    restaurantName,
    category,
    town,
    state,
    address,
    phone,
    website,
    dishes,
    rawSource: 'datafiniti'
  };
}

/**
 * Parses Menus API scraper response object
 */
export function parseMenusApiJson(parsedObj: any): ParsedRestaurantPayload {
  const restaurantName = parsedObj.restaurant_name || parsedObj.name || 'Extracted Restaurant';
  const address = parsedObj.address || '';
  const phone = parsedObj.phone || '';
  const website = parsedObj.website || '';

  const dishes: ParsedApiMenuItem[] = [];

  // 1. Nested sections format (menu.sections.items)
  if (parsedObj.menu && Array.isArray(parsedObj.menu.sections)) {
    parsedObj.menu.sections.forEach((sec: any) => {
      const sectionName = sec.name || 'Mains';
      if (Array.isArray(sec.items)) {
        sec.items.forEach((item: any) => {
          if (!item.name) return;
          const price = parseFloat(String(item.price || item.amount || 0));
          dishes.push({
            name: String(item.name).trim(),
            price: isNaN(price) ? 9.99 : price,
            category: sectionName,
            description: item.description || '',
            imageUrl: item.image_url || item.imageUrl,
            dietaryTags: Array.isArray(item.dietary_tags) ? item.dietary_tags : undefined
          });
        });
      }
    });
  } 
  // 2. Flat dishes list
  else if (Array.isArray(parsedObj.dishes)) {
    parsedObj.dishes.forEach((item: any) => {
      if (!item.name) return;
      const price = parseFloat(String(item.price || item.amount || 0));
      dishes.push({
        name: String(item.name).trim(),
        price: isNaN(price) ? 9.99 : price,
        category: item.category || item.section || 'Mains',
        description: item.description || '',
        imageUrl: item.image_url || item.imageUrl,
        dietaryTags: Array.isArray(item.dietary_tags) ? item.dietary_tags : undefined
      });
    });
  }
  // 3. Direct array of dishes
  else if (Array.isArray(parsedObj)) {
    parsedObj.forEach((item: any) => {
      if (!item.name && !item.title) return;
      const price = parseFloat(String(item.price || item.amount || 0));
      dishes.push({
        name: String(item.name || item.title).trim(),
        price: isNaN(price) ? 9.99 : price,
        category: item.category || item.section || 'Mains',
        description: item.description || '',
        imageUrl: item.image_url || item.imageUrl
      });
    });
  }

  return {
    restaurantName,
    address,
    phone,
    website,
    dishes,
    rawSource: 'menus_api'
  };
}

/**
 * Universal detector for Datafiniti, Menus API, or raw JSON
 */
export function detectAndParseMenuJson(rawJson: string): { success: boolean; payload?: ParsedRestaurantPayload; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    
    // Check if Datafiniti schema (has menus array or phoneNumbers, city, province)
    if (parsed.menus || (Array.isArray(parsed) && parsed[0]?.menus) || parsed.city || parsed.province) {
      return { success: true, payload: parseDatafinitiJson(parsed) };
    }

    // Check if Menus API schema (has menu.sections or dishes or scraper_type)
    if (parsed.menu?.sections || parsed.dishes || parsed.scraper_type) {
      return { success: true, payload: parseMenusApiJson(parsed) };
    }

    // Default fallback to Menus API flat / direct parser
    const fallback = parseMenusApiJson(parsed);
    if (fallback.dishes.length > 0) {
      return { success: true, payload: fallback };
    }

    return { success: false, error: 'JSON parsed successfully but no menu items or restaurant structure were found in the payload.' };
  } catch (err: any) {
    return { success: false, error: `Invalid JSON syntax: ${err.message || 'Please check brackets and commas'}` };
  }
}
