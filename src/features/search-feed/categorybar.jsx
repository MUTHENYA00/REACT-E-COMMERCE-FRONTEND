function CategoryBar() {
  return (
   
    <div className="w-full bg-white border-b border-gray-200 py-3 px-5 block">
      
      {/* INNER LINK WRAPPER */}
      <div className="w-full flex items-center justify-start gap-[15px] py-4 px-5 bg-white border-b border-gray-100">
        {/* Category items with a smooth hover link coloring effect */}
        <a href="/category/all" className="category-pill">
          All Categories
        </a>
        <a href="/category/Latest Devices" className="category-pill">
          Latest Devices
        </a>
        <a href="/category/anniversaries" className="category-pill">
          Happy Father's Day
        </a>
        <a href="/category/Books" className="category-pill">
          Books
        </a>
        <a href="/category/deals" className="category-pill">
          Best Deals
        </a>

      </div>

    </div>
  )
}

export default CategoryBar
