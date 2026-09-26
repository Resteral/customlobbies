'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorefrontProduct, MerchantStorefront, SelectedOption } from '@/lib/types';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Minus, Check, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodCustomizerModalProps {
  product: StorefrontProduct;
  store: MerchantStorefront;
  onClose: () => void;
  onAdded?: () => void;
}

export default function FoodCustomizerModal({ product, store, onClose, onAdded }: FoodCustomizerModalProps) {
  const router = useRouter();
  const { addToCart, placeDeliveryOrder } = useNfcStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<{ [groupId: string]: string[] }>(() => {
    const initial: { [groupId: string]: string[] } = {};
    product.optionGroups?.forEach(group => {
      if (group.type === 'single' && group.choices.length > 0) {
        initial[group.id] = [group.choices[0].id];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Toggle single or multiple choices
  const handleSelectChoice = (groupId: string, choiceId: string, type: 'single' | 'multiple') => {
    setSelectedChoices(prev => {
      if (type === 'single') {
        return { ...prev, [groupId]: [choiceId] };
      } else {
        const current = prev[groupId] || [];
        const exists = current.includes(choiceId);
        return {
          ...prev,
          [groupId]: exists ? current.filter(id => id !== choiceId) : [...current, choiceId]
        };
      }
    });
  };

  // Calculate dynamic item price with selected option add-ons
  let unitPrice = product.price;
  const selectedOptionsList: SelectedOption[] = [];

  product.optionGroups?.forEach(group => {
    const chosenIds = selectedChoices[group.id] || [];
    group.choices.forEach(choice => {
      if (chosenIds.includes(choice.id)) {
        unitPrice += choice.priceDelta;
        selectedOptionsList.push({
          groupTitle: group.title,
          choiceName: choice.name,
          priceDelta: choice.priceDelta,
        });
      }
    });
  });

  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    // Convert to ReviewProduct shape for standard cart or direct food drawer
    const formattedOptionsText = selectedOptionsList.length > 0 
      ? selectedOptionsList.map(o => `${o.choiceName}${o.priceDelta > 0 ? ` (+$${o.priceDelta.toFixed(2)})` : ''}`).join(', ')
      : '';

    const fullNameWithCustomizations = formattedOptionsText 
      ? `${product.name} [${formattedOptionsText}]`
      : product.name;

    addToCart({
      id: `food-${product.id}-${Date.now()}`,
      name: fullNameWithCustomizations,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subtitle: `${store.businessName} • ${store.town}`,
      description: specialInstructions ? `${product.description} (Note: "${specialInstructions}")` : product.description,
      price: unitPrice,
      rating: 5.0,
      reviewsCount: 1,
      category: 'food',
      features: selectedOptionsList.map(o => o.choiceName),
      imageUrl: product.imageUrl,
      inStock: true,
      sellerName: store.businessName,
      sellerPhone: store.phone,
      town: `${store.town}, ${store.state}`,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    setIsAddedSuccess(true);
    setTimeout(() => {
      if (onAdded) onAdded();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0d14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-4">
          {/* Header Image */}
          <div className="relative h-56 w-full bg-zinc-900">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-black/30" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-black/70 px-2.5 py-1 rounded-lg border border-amber-400/30">
                  {store.businessName}
                </span>
                <h2 className="text-2xl font-black italic tracking-tight text-white uppercase mt-1">
                  {product.name}
                </h2>
              </div>
              <span className="text-lg font-mono font-black text-amber-400 bg-black/80 px-3 py-1 rounded-xl border border-white/10">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          {/* Description & Calories */}
          <div className="p-6 space-y-6">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                {product.calories && <span>⚡ {product.calories}</span>}
                {product.dietaryTags?.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Option Groups (DoorDash style choices) */}
            {product.optionGroups && product.optionGroups.length > 0 && (
              <div className="space-y-6">
                {product.optionGroups.map(group => {
                  const chosen = selectedChoices[group.id] || [];

                  return (
                    <div key={group.id} className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                            <span>{group.title}</span>
                            {group.required && (
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                Required
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            {group.type === 'single' ? 'Select 1 option' : 'Choose any options'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {group.choices.map(choice => {
                          const isSelected = chosen.includes(choice.id);

                          return (
                            <div
                              key={choice.id}
                              onClick={() => handleSelectChoice(group.id, choice.id, group.type)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                isSelected
                                  ? 'bg-amber-400/10 border-amber-400 text-white'
                                  : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.04]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-${group.type === 'single' ? 'full' : 'md'} border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-amber-400 border-amber-400 text-black'
                                    : 'border-white/20'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="font-medium">{choice.name}</span>
                              </div>

                              {choice.priceDelta > 0 && (
                                <span className="font-mono text-amber-400 font-bold text-[11px]">
                                  +{formatCurrency(choice.priceDelta)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Special Instructions Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span>Special Cooking or Delivery Instructions</span>
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Dressing on the side, extra crispy, no pickles..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-5 border-t border-white/10 bg-[#070709] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1.5">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm text-white px-2">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAddedSuccess}
            className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isAddedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>Added to Basket!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add to Order • {formatCurrency(totalPrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
