import React from 'react';
import { Link } from 'react-router-dom';

export function RecommendationsCarousel({ recommendations, formatPrice }) {
  // If the server returns no recommendations, professionals hide the section entirely
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mt-24 pt-12 border-t border-gray-200 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Recommended Collections
        </h3>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
          Similar Items You May Like
        </p>
      </div>
      
      {/* ISOLATED HORIZONTAL SCROLL TRACK */}
      <div className="w-full overflow-x-auto flex gap-6 pb-4 scrollbar-none snap-x snap-mandatory">
        {recommendations.slice(0, 4).map((item) => (
          <Link
            to={`/product/${item.id || item._id}`}
            state={{ product: item }} 
            key={item.id || item._id}
            className="group flex-shrink-0 w-64 snap-start flex flex-col bg-white border border-gray-100 rounded-2xl p-3 shadow-xs"
            style={{ textDecoration: 'none' }}
          >
            {/* Visual Frame Asset Box */}
            <div className="w-full aspect-square overflow-hidden bg-neutral-50 rounded-xl border border-gray-100 flex items-center justify-center">
              <img
                src={item.imageName ? `http://localhost:5000${item.imageName}` : (item.imageUrl || item.image)}
                alt="Recommended element lookup"
                loading="lazy"
                className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            
            {/* Details & Pricing Metadata Fields */}
            <div className="flex flex-col pt-3 space-y-1">
              <p className="text-gray-800 text-sm font-bold line-clamp-1 m-0">
                {item.title || item.name}
              </p>
              <p className="text-gray-500 text-xs line-clamp-2 leading-tight m-0">
                {item.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-black text-teal-700">
                  {formatPrice(item.price)}
                </span>
                <span className="text-[10px] font-black text-gray-400 group-hover:text-teal-600 transition-colors uppercase tracking-wider">
                  View Asset
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
