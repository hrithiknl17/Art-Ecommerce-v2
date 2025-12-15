
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Star, ShieldCheck, Crown, Box, ZoomIn } from 'lucide-react';
import { Button } from '../components/ui/Elements';
import { useNavigation } from '../contexts/NavigationContext';
import { useData, formatRupee } from '../contexts/DataContext';
import Shop from './Shop';

const ProductDetail = () => {
  const { setView } = useNavigation();
  const { selectedProduct, addToCart } = useData();
  const [activeImage, setActiveImage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
    }
  }, [selectedProduct]);

  // Mouse Handler for Zoom Lens
  useEffect(() => {
    if (!imageContainerRef.current) return;

    const container = imageContainerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update cursor pos for zoom lens
      const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

      setCursorPos({ x: xPercent, y: yPercent });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!selectedProduct) return <Shop />;

  // Gallery Logic
  const gallery = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : [selectedProduct.image];

  return (
    <div className="bg-[#F8F5F1] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setView('shop')} className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] mb-8 transition-colors">
          <ChevronRight className="rotate-180 mr-2" size={14} /> Return to Catalogue
        </button>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          
          {/* Gallery Section */}
          <div className="lg:col-span-8 flex flex-col-reverse lg:flex-row gap-6">
            
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible lg:w-24 flex-shrink-0 scrollbar-hide">
               {gallery.map((img, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setActiveImage(img)}
                   className={`relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 border-2 transition-all duration-300 overflow-hidden ${activeImage === img ? 'border-[#C5A059] ring-1 ring-[#C5A059] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

            {/* Main Image Container */}
            <div className="relative flex-1 bg-white frame-antique p-4 aspect-[4/5] lg:aspect-auto overflow-hidden group">
               <div 
                 ref={imageContainerRef}
                 className="w-full h-full relative cursor-crosshair overflow-hidden"
               >
                 {/* Main Image */}
                 <img
                   src={activeImage}
                   alt={selectedProduct.name}
                   className={`w-full h-full object-cover shadow-inner transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                 />
                 
                 {/* Zoom Lens Image (Visible on Hover) */}
                 <div 
                    className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundPosition: `${cursorPos.x}% ${cursorPos.y}%`,
                      backgroundSize: '250%',
                      opacity: isHovering ? 1 : 0
                    }}
                 />
               </div>
               
               {/* Zoom Indicator */}
               <div className="absolute top-8 right-8 z-10 p-3 bg-white/80 backdrop-blur rounded-full shadow-xl text-gray-500 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                   <ZoomIn size={20} />
               </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-4 mt-12 lg:mt-0 flex flex-col">
             <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] mb-4">
               {selectedProduct.category}
             </span>
             <h1 className="text-4xl md:text-5xl font-vogue text-[#1A1A1A] mb-6 leading-[0.9]">{selectedProduct.name}</h1>
             
             <div className="flex items-baseline gap-6 mb-8 border-b border-gray-200 pb-8">
                <p className="text-3xl font-sans font-light text-[#1A1A1A]">{formatRupee(selectedProduct.price)}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={`${i < Math.floor(selectedProduct.rating) ? 'text-[#1A1A1A]' : 'text-gray-300'} fill-current`} />
                  ))}
                  <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{selectedProduct.rating}</span>
                </div>
             </div>

             <div className="prose prose-sm text-gray-600 font-sans mb-12 leading-relaxed">
               <p>
                 This exquisite piece represents the pinnacle of craftsmanship. Sourced from the finest ateliers and preserved with the utmost care, it brings a touch of history and elegance to the modern collection.
               </p>
               <ul className="list-none pl-0 space-y-2 mt-4 text-xs uppercase tracking-wider text-[#1A1A1A]">
                 <li className="flex items-center gap-2"><div className="w-1 h-1 bg-black rounded-full"/> Authentic Period Reproduction</li>
                 <li className="flex items-center gap-2"><div className="w-1 h-1 bg-black rounded-full"/> Hand-finished details</li>
                 <li className="flex items-center gap-2"><div className="w-1 h-1 bg-black rounded-full"/> Verified Provenance</li>
               </ul>
             </div>

             <div className="space-y-4 mb-8">
                <Button 
                  className="w-full py-5"
                  onClick={() => { addToCart(selectedProduct); }}
                >
                  Add to Cart
                </Button>
                <div className="flex justify-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  <span>In Stock: {selectedProduct.stock}</span>
                  <span>•</span>
                  <span>Ships Worldwide</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
                <div className="flex items-start gap-3">
                   <ShieldCheck size={20} className="text-[#C5A059] mt-1" />
                   <div>
                     <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">Authentic</h4>
                     <p className="text-[10px] text-gray-500 leading-tight">Verified by our expert curators.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Crown size={20} className="text-[#C5A059] mt-1" />
                   <div>
                     <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">Premium</h4>
                     <p className="text-[10px] text-gray-500 leading-tight">Highest quality materials guaranteed.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Box size={20} className="text-[#C5A059] mt-1" />
                   <div>
                     <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">Secure</h4>
                     <p className="text-[10px] text-gray-500 leading-tight">Professional crate packaging.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
