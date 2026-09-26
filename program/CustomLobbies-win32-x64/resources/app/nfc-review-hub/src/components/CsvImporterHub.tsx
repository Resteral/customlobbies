'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  parseCsvText, 
  autoMapHeaders, 
  generateCsvString, 
  downloadCsvFile,
  detectAndParseMenuJson,
  SAMPLE_DATAFINITI_JSON,
  SAMPLE_MENUS_API_JSON,
  ParsedRestaurantPayload,
  BUSINESS_FIELD_SYNONYMS,
  PRODUCT_FIELD_SYNONYMS,
  MARKETPLACE_FIELD_SYNONYMS
} from '@/lib/csv-parser';
import { DirectoryCategory, StorefrontProduct, ReviewProduct, MerchantStorefront } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Table, 
  Trash2, 
  Edit2, 
  ArrowRight, 
  Store, 
  Utensils, 
  ShoppingBag, 
  Layers, 
  RefreshCw, 
  Check, 
  X, 
  Copy,
  ChevronDown,
  Info,
  Database,
  Code2,
  FileCode,
  Zap,
  Globe,
  MapPin,
  Phone,
  Tag,
  Calendar
} from 'lucide-react';

type ImportMode = 'businesses' | 'storefront_products' | 'marketplace_products' | 'datafiniti_menus_api';

const SAMPLE_BUSINESS_CSV = `Name,Category,Town,Address,Phone,Website,GoogleRating,ReviewCount,Description
Poor Peoples Pub,dining_bars,Sanbornville,28 Meadow St,603-522-8991,https://poorpeoplespub.com,4.6,342,Legendary Carroll County pub with wood-fired burgers and craft beer
River's Edge Grille,dining_bars,Center Ossipee,123 Route 16,603-539-1122,https://riversedge.com,4.8,215,Scenic riverside dining featuring fresh Maine lobster rolls and steaks
Effingham General Store,retail_artisan,Effingham,45 Elm Street,603-539-4400,,4.9,189,Historic country general store with fresh baked pies and local crafts
White Mountain Woodcraft,trades_contractors,Freedom,88 Mountain Rd,603-651-7700,,5.0,94,Handcrafted timber tables and custom pine cabinetry
Lakes Region Marine & Small Engine,auto_marine,Wolfeboro,502 Center St,603-569-2200,https://lakesmarine.com,4.7,112,Full outboard repair and snowmobile maintenance`;

const SAMPLE_MENU_CSV = `Item Name,Price,Category,Description,Badge,Dietary,Calories,ImageUrl
Classic Smash Bacon Burger,14.99,Burgers & Sandwiches,Double smashed beef patties with applewood bacon and secret pub sauce,Bestseller,Dairy,850,https://images.unsplash.com/photo-1568901346375-23c9450c58cd
Fresh Lobster Roll (Warm Butter),24.50,Seafood & Mains,Quarter pound fresh Maine claw & knuckle meat in a toasted brioche bun,Chef Special,Gluten-Free Option,520,https://images.unsplash.com/photo-1533777857889-4be7c70b33f7
Wood-Fired Margherita Pizza,16.00,Pizzas,San Marzano tomato sauce fresh buffalo mozzarella and garden basil,Vegetarian,Vegetarian,780,https://images.unsplash.com/photo-1513104890138-7c749659a591
Local Maple Sugar Donut Stack,7.50,Desserts,Warm cinnamon sugar donuts drizzled with Carroll County grade-A amber maple syrup,Local Favorite,,420,https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5
Crispy Haddock Fish & Chips,18.95,Seafood & Mains,Fresh Atlantic haddock in beer batter served with house tartar and fries,Popular,,910,https://images.unsplash.com/photo-1579208575657-c595a05383b7`;

const SAMPLE_MARKETPLACE_CSV = `Title,Subtitle,Price,Category,Town,SellerName,Badge,Rating,InStock,ImageUrl
Carroll County Amber Maple Syrup 16oz,Pure Single-Origin Harvest,18.00,artisan,Effingham,Mountain View Sugarhouse,Farm Direct,5.0,true,https://images.unsplash.com/photo-1589301760014-d929f3979dbc
Hand-Carved Cedar Coaster Set (4-Pack),Aromatic White Mountain Cedar,24.00,artisan,Freedom,Ossipee Valley Woodcraft,Handmade,4.9,true,https://images.unsplash.com/photo-1615873968403-89e068629265
Obsidian Smart NFC Business Card,Instant Google Reviews & Tap Relay,29.99,cards,Effingham,Townraise Hardware,Best Seller,5.0,true,https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe
Cyber Glass NFC Tabletop Stand,Dual-Sided QR & NFC Tap Zone,49.99,stands,Wolfeboro,Townraise Hardware,Pro Tier,4.9,true,https://images.unsplash.com/photo-1544816155-12df9643f363`;

interface CsvImporterHubProps {
  initialMode?: ImportMode;
  targetStorefrontId?: string;
  onImportComplete?: (importedCount: number) => void;
}

export default function CsvImporterHub({
  initialMode = 'businesses',
  targetStorefrontId,
  onImportComplete
}: CsvImporterHubProps) {
  const { 
    directoryListings, 
    storefronts, 
    products, 
    bulkImportDirectoryListings, 
    bulkImportStorefrontProducts, 
    bulkImportMarketplaceProducts,
    createStorefront,
    activeTown
  } = useNfcStore();

  const [mode, setMode] = useState<ImportMode>(initialMode);
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>(
    targetStorefrontId || storefronts[0]?.id || ''
  );
  const [rawInputText, setRawInputText] = useState<string>('');
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Datafiniti & Menus API State
  const [jsonPayload, setJsonPayload] = useState<ParsedRestaurantPayload | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [apiImportTarget, setApiImportTarget] = useState<'create_new' | 'existing'>('create_new');

  const [importSuccessResult, setImportSuccessResult] = useState<{
    count: number;
    mode: ImportMode;
    timestamp: string;
    storefrontName?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active mapping schema based on mode
  const currentSynonymsMap = useMemo(() => {
    switch (mode) {
      case 'businesses': return BUSINESS_FIELD_SYNONYMS;
      case 'storefront_products': return PRODUCT_FIELD_SYNONYMS;
      case 'marketplace_products': return MARKETPLACE_FIELD_SYNONYMS;
      default: return PRODUCT_FIELD_SYNONYMS;
    }
  }, [mode]);

  // Target schema fields list
  const targetFields = useMemo(() => {
    return Object.keys(currentSynonymsMap);
  }, [currentSynonymsMap]);

  // Parse Raw Text whenever text changes or is loaded
  const handleParseText = (text: string) => {
    setRawInputText(text);
    setImportSuccessResult(null);

    if (mode === 'datafiniti_menus_api') {
      if (!text.trim()) {
        setJsonPayload(null);
        setJsonError(null);
        setSelectedRowIndices(new Set());
        return;
      }

      const res = detectAndParseMenuJson(text);
      if (res.success && res.payload) {
        setJsonPayload(res.payload);
        setJsonError(null);
        setSelectedRowIndices(new Set(res.payload.dishes.map((_, i) => i)));
      } else {
        setJsonPayload(null);
        setJsonError(res.error || 'Failed to parse JSON.');
        setSelectedRowIndices(new Set());
      }
      return;
    }

    if (!text.trim()) {
      setParsedHeaders([]);
      setParsedRows([]);
      setSelectedRowIndices(new Set());
      return;
    }

    const { headers, rows } = parseCsvText(text);
    setParsedHeaders(headers);
    setParsedRows(rows);

    // Auto-map headers
    const autoMap = autoMapHeaders(headers, currentSynonymsMap);
    setFieldMappings(autoMap);

    // Select all parsed rows by default
    const allIndices = new Set(rows.map((_, i) => i));
    setSelectedRowIndices(allIndices);
  };

  // Handle file drop or upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseText(content);
    };
    reader.readAsText(file);
  };

  // Load preset sample CSV or JSON
  const handleLoadSample = (sampleType: ImportMode) => {
    setMode(sampleType);
    if (sampleType === 'businesses') handleParseText(SAMPLE_BUSINESS_CSV);
    else if (sampleType === 'storefront_products') handleParseText(SAMPLE_MENU_CSV);
    else if (sampleType === 'marketplace_products') handleParseText(SAMPLE_MARKETPLACE_CSV);
    else if (sampleType === 'datafiniti_menus_api') handleParseText(SAMPLE_DATAFINITI_JSON);
  };

  // Load Menus API Scraper sample specifically
  const handleLoadMenusApiSample = () => {
    setMode('datafiniti_menus_api');
    handleParseText(SAMPLE_MENUS_API_JSON);
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    let content = '';
    let fileName = '';
    if (mode === 'businesses') {
      content = SAMPLE_BUSINESS_CSV;
      fileName = 'townraise_restaurants_businesses_template.csv';
    } else if (mode === 'storefront_products') {
      content = SAMPLE_MENU_CSV;
      fileName = 'townraise_menu_products_template.csv';
    } else if (mode === 'marketplace_products') {
      content = SAMPLE_MARKETPLACE_CSV;
      fileName = 'townraise_marketplace_inventory_template.csv';
    } else {
      content = SAMPLE_DATAFINITI_JSON;
      fileName = 'datafiniti_restaurant_menu_sample.json';
    }
    downloadCsvFile(content, fileName);
  };

  // Export current live data to CSV
  const handleExportCurrentData = () => {
    if (mode === 'businesses') {
      const data = directoryListings.map(d => ({
        Name: d.name,
        Category: d.category,
        CategoryLabel: d.categoryLabel,
        Town: d.town,
        Address: d.address,
        Phone: d.phone,
        Website: d.website || '',
        GoogleRating: d.googleRating,
        ReviewCount: d.reviewCount,
        IsClaimed: d.isClaimed,
      }));
      downloadCsvFile(generateCsvString(data), 'carroll_county_directory_export.csv');
    } else if (mode === 'storefront_products') {
      const sf = storefronts.find(s => s.id === selectedStorefrontId) || storefronts[0];
      const data = (sf?.products || []).map(p => ({
        ItemName: p.name,
        Price: p.price,
        Category: p.category,
        Description: p.description,
        Badge: p.badge || '',
        InStock: p.inStock,
        Calories: p.calories || '',
        ImageUrl: p.imageUrl,
      }));
      downloadCsvFile(generateCsvString(data), `${sf?.slug || 'storefront'}_products_export.csv`);
    } else if (mode === 'marketplace_products') {
      const data = products.map(p => ({
        Title: p.name,
        Subtitle: p.subtitle,
        Price: p.price,
        Category: p.category,
        Town: p.town || 'Effingham',
        SellerName: p.sellerName || 'Townraise Artisan',
        Rating: p.rating,
        InStock: p.inStock,
        ImageUrl: p.imageUrl,
      }));
      downloadCsvFile(generateCsvString(data), 'townraise_marketplace_products_export.csv');
    } else {
      // Export all restaurants as JSON
      const jsonStr = JSON.stringify(storefronts, null, 2);
      downloadCsvFile(jsonStr, 'townraise_all_storefronts_and_menus.json');
    }
  };

  // Toggle row selection
  const toggleRowSelection = (index: number) => {
    const next = new Set(selectedRowIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedRowIndices(next);
  };

  const toggleSelectAll = () => {
    const totalItems = mode === 'datafiniti_menus_api' 
      ? (jsonPayload?.dishes.length || 0)
      : parsedRows.length;

    if (selectedRowIndices.size === totalItems) {
      setSelectedRowIndices(new Set());
    } else {
      setSelectedRowIndices(new Set(Array.from({ length: totalItems }, (_, i) => i)));
    }
  };

  const deleteRow = (index: number) => {
    if (mode === 'datafiniti_menus_api' && jsonPayload) {
      const updatedDishes = jsonPayload.dishes.filter((_, i) => i !== index);
      setJsonPayload({ ...jsonPayload, dishes: updatedDishes });
      const nextSelected = new Set<number>();
      updatedDishes.forEach((_, i) => {
        if (selectedRowIndices.has(i)) nextSelected.add(i);
      });
      setSelectedRowIndices(nextSelected);
      return;
    }

    const updated = parsedRows.filter((_, i) => i !== index);
    setParsedRows(updated);
    const nextSelected = new Set<number>();
    updated.forEach((_, i) => {
      if (selectedRowIndices.has(i)) nextSelected.add(i);
    });
    setSelectedRowIndices(nextSelected);
  };

  // Execute Bulk Import
  const handleExecuteImport = () => {
    if (selectedRowIndices.size === 0) return;
    setIsProcessing(true);

    let importedCount = 0;
    let targetStoreName = '';

    try {
      // 1. Datafiniti / Menus API JSON Mode
      if (mode === 'datafiniti_menus_api' && jsonPayload) {
        const dishesToImport = jsonPayload.dishes.filter((_, idx) => selectedRowIndices.has(idx));
        
        const formattedProducts: Omit<StorefrontProduct, 'id'>[] = dishesToImport.map(d => ({
          name: d.name,
          description: d.description || 'Fresh chef-prepared dish with authentic local ingredients.',
          price: d.price,
          category: d.category || 'Mains',
          imageUrl: d.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
          inStock: true,
          badge: d.badge || (d.dateObserved ? 'Verified Price' : undefined),
          dietaryTags: d.dietaryTags,
          calories: d.calories
        }));

        if (apiImportTarget === 'create_new') {
          const slug = jsonPayload.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `sf-${Date.now()}`;
          const newSf = createStorefront({
            slug,
            businessName: jsonPayload.restaurantName,
            tagline: `${jsonPayload.town || activeTown.name} Fresh Menus & Roadside Kitchen`,
            description: `Official digital storefront and ordering menu for ${jsonPayload.restaurantName}, located in ${jsonPayload.town || activeTown.name}, NH.`,
            logoEmoji: '🍽️',
            coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
            phone: jsonPayload.phone || '(603) 508-0305',
            email: `contact@${slug}.local`,
            address: jsonPayload.address || `${jsonPayload.town || 'Effingham'}, NH`,
            town: jsonPayload.town || activeTown.name || 'Effingham',
            state: jsonPayload.state || 'NH',
            accentColor: '#f59e0b',
            deliveryFee: 3.99,
            minOrder: 12.00,
            estimatedPrepTime: '20-30 mins',
            googleRating: 4.9,
            reviewsCount: 142,
            googleReviewUrl: `https://www.google.com/search?q=${encodeURIComponent(jsonPayload.restaurantName)}`,
            enablePickup: true,
            enableDelivery: true,
            listOnMarketplace: true,
            isPublished: true,
            products: formattedProducts.map((p, i) => ({ ...p, id: `dish-${Date.now()}-${i}` }))
          });
          targetStoreName = newSf.businessName;
          importedCount = formattedProducts.length;
        } else {
          const targetSfId = selectedStorefrontId || storefronts[0]?.id || '';
          const targetSf = storefronts.find(s => s.id === targetSfId);
          bulkImportStorefrontProducts(targetSfId, formattedProducts);
          targetStoreName = targetSf?.businessName || 'Storefront';
          importedCount = formattedProducts.length;
        }

      } else if (mode === 'businesses') {
        const rowsToImport = parsedRows.filter((_, idx) => selectedRowIndices.has(idx));
        const formattedListings = rowsToImport.map(row => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Name'] || row['name'] || 'Unnamed Business';
          const rawCat = (fieldMappings.category && row[fieldMappings.category]) || row['Category'] || 'dining_bars';
          
          let category: DirectoryCategory = 'dining_bars';
          const catLower = rawCat.toLowerCase();
          if (catLower.includes('bar') || catLower.includes('din') || catLower.includes('food') || catLower.includes('restaurant')) category = 'dining_bars';
          else if (catLower.includes('contract') || catLower.includes('trade') || catLower.includes('carp') || catLower.includes('roof')) category = 'trades_contractors';
          else if (catLower.includes('lodge') || catLower.includes('cabin') || catLower.includes('hotel') || catLower.includes('camp')) category = 'lodging_cabins';
          else if (catLower.includes('auto') || catLower.includes('marine') || catLower.includes('engine') || catLower.includes('boat')) category = 'auto_marine';
          else if (catLower.includes('health') || catLower.includes('well') || catLower.includes('spa') || catLower.includes('gym')) category = 'health_wellness';
          else if (catLower.includes('retail') || catLower.includes('store') || catLower.includes('art') || catLower.includes('shop')) category = 'retail_artisan';
          else if (catLower.includes('prof') || catLower.includes('serv') || catLower.includes('law') || catLower.includes('realt')) category = 'professional_services';

          const town = (fieldMappings.town && row[fieldMappings.town]) || row['Town'] || activeTown?.name || 'Effingham';
          const address = (fieldMappings.address && row[fieldMappings.address]) || row['Address'] || `${town}, NH`;
          const phone = (fieldMappings.phone && row[fieldMappings.phone]) || row['Phone'] || '(603) 508-0305';
          const website = (fieldMappings.website && row[fieldMappings.website]) || row['Website'] || undefined;
          const googleRating = Number((fieldMappings.googleRating && row[fieldMappings.googleRating]) || row['GoogleRating'] || 4.8);
          const reviewCount = Number((fieldMappings.reviewCount && row[fieldMappings.reviewCount]) || row['ReviewCount'] || 12);
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || '';

          const categoryLabels: Record<DirectoryCategory, string> = {
            dining_bars: 'Dining & Craft Bars',
            trades_contractors: 'Trades & Contractors',
            lodging_cabins: 'Lakeside Lodging & Cabins',
            auto_marine: 'Auto, 4x4 & Marine',
            health_wellness: 'Health & Mountain Wellness',
            retail_artisan: 'Retail & Heritage Goods',
            professional_services: 'Professional Services',
          };

          return {
            name,
            category,
            categoryLabel: categoryLabels[category],
            town,
            state: 'NH',
            address,
            phone,
            website,
            googleRating: isNaN(googleRating) ? 4.8 : googleRating,
            reviewCount: isNaN(reviewCount) ? 24 : reviewCount,
            isClaimed: true,
            claimedBy: name,
            verifiedBadge: true,
            nfcEnabled: true,
            offersDelivery: category === 'dining_bars',
            coverImage: category === 'dining_bars' 
              ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' 
              : 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800',
            description,
            tags: [category, town, 'Verified Local'],
          };
        });

        bulkImportDirectoryListings(formattedListings);
        importedCount = formattedListings.length;

      } else if (mode === 'storefront_products') {
        const rowsToImport = parsedRows.filter((_, idx) => selectedRowIndices.has(idx));
        const targetSfId = selectedStorefrontId || storefronts[0]?.id || 'storefront-sean-tap';
        const targetSf = storefronts.find(s => s.id === targetSfId);
        const formattedProducts = rowsToImport.map((row, i) => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Item Name'] || row['name'] || `Menu Item ${i + 1}`;
          const price = Number((fieldMappings.price && row[fieldMappings.price]) || row['Price'] || 12.99);
          const category = (fieldMappings.category && row[fieldMappings.category]) || row['Category'] || 'Mains';
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || 'Fresh local ingredients made to order.';
          const badge = (fieldMappings.badge && row[fieldMappings.badge]) || row['Badge'] || undefined;
          const imageUrl = (fieldMappings.imageUrl && row[fieldMappings.imageUrl]) || row['ImageUrl'] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
          const calories = (fieldMappings.calories && row[fieldMappings.calories]) || row['Calories'] || undefined;

          return {
            name,
            price: isNaN(price) ? 9.99 : price,
            category,
            description,
            imageUrl,
            badge,
            calories,
            inStock: true,
          };
        });

        bulkImportStorefrontProducts(targetSfId, formattedProducts);
        targetStoreName = targetSf?.businessName || 'Storefront';
        importedCount = formattedProducts.length;

      } else {
        // marketplace_products
        const rowsToImport = parsedRows.filter((_, idx) => selectedRowIndices.has(idx));
        const formattedProducts = rowsToImport.map((row, i) => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Title'] || row['name'] || `Artisan Good ${i + 1}`;
          const price = Number((fieldMappings.price && row[fieldMappings.price]) || row['Price'] || 24.99);
          const subtitle = (fieldMappings.subtitle && row[fieldMappings.subtitle]) || row['Subtitle'] || 'Crafted in Carroll County';
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || 'Locally crafted authentic mountain goods.';
          const town = (fieldMappings.town && row[fieldMappings.town]) || row['Town'] || 'Effingham';
          const sellerName = (fieldMappings.sellerName && row[fieldMappings.sellerName]) || row['SellerName'] || 'Local Artisan';
          const imageUrl = (fieldMappings.imageUrl && row[fieldMappings.imageUrl]) || row['ImageUrl'] || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc';
          const badge = (fieldMappings.badge && row[fieldMappings.badge]) || row['Badge'] || 'Local Craft';
          const rating = Number((fieldMappings.rating && row[fieldMappings.rating]) || row['Rating'] || 5.0);

          return {
            name,
            subtitle,
            description,
            price: isNaN(price) ? 19.99 : price,
            category: 'artisan' as const,
            features: ['Locally Made', '100% Guaranteed', 'Carroll County Pioneer'],
            imageUrl,
            inStock: true,
            badge,
            rating: isNaN(rating) ? 5.0 : rating,
            reviewsCount: 14,
            town,
            sellerName,
          };
        });

        bulkImportMarketplaceProducts(formattedProducts);
        importedCount = formattedProducts.length;
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setImportSuccessResult({
        count: importedCount,
        mode,
        timestamp: new Date().toLocaleTimeString(),
        storefrontName: targetStoreName
      });

      if (onImportComplete) {
        onImportComplete(importedCount);
      }

      // Reset parser table
      setParsedRows([]);
      setParsedHeaders([]);
      setJsonPayload(null);
      setRawInputText('');
      setSelectedRowIndices(new Set());

    } catch (err) {
      console.error('Import failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ======================================================== */}
      {/* 1. IMPORT MODE SELECTION & STATS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mode 1: Restaurants & Businesses */}
        <button
          onClick={() => { setMode('businesses'); handleLoadSample('businesses'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'businesses'
              ? 'bg-amber-400/10 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'businesses' ? 'bg-amber-400 text-black' : 'bg-white/10 text-amber-400'
            }`}>
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              CSV
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
            🏪 Directory Listings
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Bulk import local stores, contractors & lodging.
          </p>
        </button>

        {/* Mode 2: Digital Menus & Storefront Products */}
        <button
          onClick={() => { setMode('storefront_products'); handleLoadSample('storefront_products'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'storefront_products'
              ? 'bg-orange-400/10 border-orange-400 shadow-xl shadow-orange-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'storefront_products' ? 'bg-orange-400 text-black' : 'bg-white/10 text-orange-400'
            }`}>
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              CSV
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-orange-300 transition-colors">
            🍽️ Restaurant Menus
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Import food dishes & subs into restaurant ordering.
          </p>
        </button>

        {/* Mode 3: Artisan & Retail Marketplace */}
        <button
          onClick={() => { setMode('marketplace_products'); handleLoadSample('marketplace_products'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'marketplace_products'
              ? 'bg-purple-400/10 border-purple-400 shadow-xl shadow-purple-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'marketplace_products' ? 'bg-purple-400 text-black' : 'bg-white/10 text-purple-400'
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              CSV
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
            ✨ Artisan Goods
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Import maple syrup, crafts & NFC smart hardware.
          </p>
        </button>

        {/* Mode 4: Datafiniti & Menus API Ingestor */}
        <button
          onClick={() => { setMode('datafiniti_menus_api'); handleLoadSample('datafiniti_menus_api'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'datafiniti_menus_api'
              ? 'bg-emerald-400/15 border-emerald-400 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-400/50'
              : 'bg-white/[0.03] border-white/10 hover:border-emerald-400/30 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'datafiniti_menus_api' ? 'bg-emerald-400 text-black' : 'bg-emerald-400/20 text-emerald-400'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold">
              JSON API
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
            <span>Datafiniti & Menus API</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Direct JSON ingestion for web, PDF & image scraper outputs.
          </p>
        </button>
      </div>

      {/* Success Banner */}
      {importSuccessResult && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-white space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-emerald-400">
                  Import Successful! {importSuccessResult.count} Items Live
                </h4>
                <p className="text-xs text-zinc-300">
                  {importSuccessResult.mode === 'businesses'
                    ? 'Records added to Carroll County Directory & live map.'
                    : importSuccessResult.mode === 'datafiniti_menus_api'
                    ? `Dishes added to ${importSuccessResult.storefrontName || 'restaurant menu'} with live delivery dispatches.`
                    : importSuccessResult.mode === 'storefront_products'
                    ? `Dishes added to ${importSuccessResult.storefrontName || 'restaurant storefront'} with live ordering.`
                    : 'Artisan goods published to Townraise Marketplace.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={
                  importSuccessResult.mode === 'businesses' ? '/directory' :
                  importSuccessResult.mode === 'marketplace_products' ? '/marketplace' :
                  '/dashboard/storefront'
                }
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>View Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. UPLOAD & INPUT CONSOLE */}
      {/* ======================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e16] border border-white/10 shadow-2xl space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-[10px] font-mono font-bold uppercase">
                {mode === 'datafiniti_menus_api' ? '⚡ JSON Ingestor' : '📄 CSV Ingestor'}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {mode === 'businesses' ? 'Directory Listings' :
                 mode === 'storefront_products' ? 'Restaurant Menu Dispatches' :
                 mode === 'datafiniti_menus_api' ? 'Datafiniti / Menus API Engine' :
                 'Townraise Marketplace Goods'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
              {mode === 'datafiniti_menus_api' ? 'Paste Datafiniti or Menus API JSON Payload' : 'Paste CSV or Upload Spreadsheet'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'datafiniti_menus_api' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLoadSample('datafiniti_menus_api')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Datafiniti Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadMenusApiSample}
                  className="px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Menus API Sample</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleLoadSample(mode)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Sample CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            )}

            <button
              type="button"
              onClick={handleExportCurrentData}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-zinc-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export Live Data</span>
            </button>
          </div>
        </div>

        {/* Storefront Target Selector (For Menu Imports) */}
        {(mode === 'storefront_products' || mode === 'datafiniti_menus_api') && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Target Restaurant Storefront</p>
                <p className="text-[11px] text-zinc-400 font-light">
                  {mode === 'datafiniti_menus_api'
                    ? 'Choose whether to auto-create a brand new restaurant from the JSON or append to an existing kitchen.'
                    : 'Select which restaurant menu to populate with these dishes.'}
                </p>
              </div>
            </div>

            {mode === 'datafiniti_menus_api' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setApiImportTarget('create_new')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    apiImportTarget === 'create_new'
                      ? 'bg-emerald-400 text-black shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  ➕ Auto-Create Storefront
                </button>
                <button
                  type="button"
                  onClick={() => setApiImportTarget('existing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    apiImportTarget === 'existing'
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Append to Existing
                </button>
                {apiImportTarget === 'existing' && (
                  <select
                    value={selectedStorefrontId}
                    onChange={(e) => setSelectedStorefrontId(e.target.value)}
                    className="px-3 py-1.5 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    {storefronts.map((sf) => (
                      <option key={sf.id} value={sf.id}>
                        {sf.logoEmoji} {sf.businessName} ({sf.town})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <select
                value={selectedStorefrontId}
                onChange={(e) => setSelectedStorefrontId(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                {storefronts.map((sf) => (
                  <option key={sf.id} value={sf.id}>
                    {sf.logoEmoji} {sf.businessName} ({sf.town}, NH) — {sf.products.length} Current Items
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Textarea for CSV or JSON */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            <span>
              {mode === 'datafiniti_menus_api' 
                ? 'Paste Raw JSON from Datafiniti API or MenusAPI.com Scraper:'
                : 'Paste Comma/Tab Separated Rows or Upload .CSV:'}
            </span>
            <span>{rawInputText ? `${rawInputText.length} characters` : 'Empty'}</span>
          </div>

          <textarea
            rows={mode === 'datafiniti_menus_api' ? 10 : 6}
            value={rawInputText}
            onChange={(e) => handleParseText(e.target.value)}
            placeholder={
              mode === 'datafiniti_menus_api'
                ? '{\n  "name": "Restaurant Name",\n  "menus": [\n    { "name": "Steak Sub", "amount": 14.99, "categories": ["Hot Subs"] }\n  ]\n}'
                : 'Name,Category,Town,Address,Phone\nExample Restaurant,dining_bars,Effingham,Route 25,(603) 539-7440'
            }
            className="w-full p-4 bg-[#08080c] border border-white/10 rounded-2xl text-white text-xs font-mono focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 resize-y"
          />

          {jsonError && mode === 'datafiniti_menus_api' && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. PARSED METADATA SUMMARY & PREVIEW */}
        {/* ======================================================== */}

        {/* DATAFINITI / MENUS API JSON EXTRACTED METADATA */}
        {mode === 'datafiniti_menus_api' && jsonPayload && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                    🍽️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{jsonPayload.restaurantName}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-mono font-bold uppercase">
                        {jsonPayload.rawSource === 'datafiniti' ? 'Datafiniti Schema' : 'Menus API Scraper'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 font-mono">
                      {jsonPayload.address && <span>📍 {jsonPayload.address}</span>}
                      {jsonPayload.phone && <span>📞 {jsonPayload.phone}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Parsed Dishes</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {jsonPayload.dishes.length} Items
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dishes Preview Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Extracted Dishes & Pricing ({selectedRowIndices.size} selected):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-mono text-amber-400 hover:underline"
                >
                  {selectedRowIndices.size === jsonPayload.dishes.length ? 'Deselect All' : 'Select All Dishes'}
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121c] border-b border-white/10 text-[10px] font-mono uppercase text-zinc-400 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRowIndices.size === jsonPayload.dishes.length && jsonPayload.dishes.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0"
                        />
                      </th>
                      <th className="p-3">Dish / Item Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0a0a0f]">
                    {jsonPayload.dishes.map((dish, idx) => {
                      const isSelected = selectedRowIndices.has(idx);
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-white/[0.03] transition-colors ${
                            isSelected ? 'bg-white/[0.01]' : 'opacity-40'
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(idx)}
                              className="rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0"
                            />
                          </td>
                          <td className="p-3 font-bold text-white whitespace-nowrap">
                            {dish.name}
                            {dish.dateObserved && (
                              <span className="ml-2 px-1.5 py-0.2 rounded bg-white/5 text-[9px] font-mono text-zinc-400">
                                Date: {dish.dateObserved.split('T')[0]}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-mono whitespace-nowrap">
                              {dish.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                            ${dish.price.toFixed(2)}
                          </td>
                          <td className="p-3 text-zinc-400 max-w-md truncate font-light">
                            {dish.description || '—'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteRow(idx)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Ingest Action Button */}
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isProcessing || selectedRowIndices.size === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Ingesting into Storefront...'
                    : `Execute 1-Click JSON Ingestion (${selectedRowIndices.size} Dishes)`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* CSV FIELD MAPPINGS & PREVIEW TABLE (For Businesses, Menus CSV & Marketplace) */}
        {mode !== 'datafiniti_menus_api' && parsedRows.length > 0 && (
          <div className="space-y-6">
            
            {/* Header Mapping Configuration */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smart Column Mapping ({Object.keys(fieldMappings).length} fields matched)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                    Match your spreadsheet columns to Townraise schema attributes.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedRowIndices.size} of {parsedRows.length} Rows Ready
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {targetFields.map(targetField => {
                  const mappedHeader = fieldMappings[targetField] || '';
                  return (
                    <div key={targetField} className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-amber-400 block font-bold truncate">
                        {targetField}
                      </label>
                      <select
                        value={mappedHeader}
                        onChange={(e) => setFieldMappings({ ...fieldMappings, [targetField]: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#15151f] border border-white/10 rounded-lg text-white text-[11px] font-mono focus:outline-none focus:border-amber-400"
                      >
                        <option value="">— Skip Column —</option>
                        {parsedHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CSV Table Preview */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Spreadsheet Rows Preview ({selectedRowIndices.size} selected):
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-mono text-amber-400 hover:underline"
                >
                  {selectedRowIndices.size === parsedRows.length ? 'Deselect All' : 'Select All Rows'}
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121c] border-b border-white/10 text-[10px] font-mono uppercase text-zinc-400 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRowIndices.size === parsedRows.length && parsedRows.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0"
                        />
                      </th>
                      {parsedHeaders.map(h => (
                        <th key={h} className="p-3 whitespace-nowrap">{h}</th>
                      ))}
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0a0a0f]">
                    {parsedRows.map((row, idx) => {
                      const isSelected = selectedRowIndices.has(idx);
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-white/[0.03] transition-colors ${
                            isSelected ? 'bg-white/[0.01]' : 'opacity-40'
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(idx)}
                              className="rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0"
                            />
                          </td>
                          {parsedHeaders.map(h => (
                            <td key={h} className="p-3 whitespace-nowrap font-light text-zinc-300 max-w-xs truncate">
                              {row[h] || '—'}
                            </td>
                          ))}
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteRow(idx)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Execute Button */}
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isProcessing || selectedRowIndices.size === 0}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Processing Bulk Import...'
                    : `Execute Bulk Import (${selectedRowIndices.size} Items)`}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
