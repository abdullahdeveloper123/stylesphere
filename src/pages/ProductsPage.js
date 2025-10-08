import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  ShoppingBag, 
  Filter, 
  Star, 
  Grid3X3, 
  List,
  Search
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://clothsonlin321.pythonanywhere.com';
const API = `${BACKEND_URL}/api`;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products${selectedCategory ? `?category_id=${selectedCategory}` : ''}`)
      ]);
      
      setCategories(categoriesRes.data.categories);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "All Products";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {selectedCategoryName}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
            
            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none w-full sm:w-64"
                  data-testid="product-search-input"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  data-testid="grid-view-button"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  data-testid="list-view-button"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Filters</h3>
              </div>
              
              {/* Categories Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <button
                  onClick={() => handleCategoryFilter("")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === ""
                      ? "bg-orange-100 text-orange-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  data-testid="category-filter-all"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    data-testid={`category-filter-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try adjusting your search terms" : "No products available in this category"}
                </p>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  viewMode === "grid" ? (
                    <Card key={product.id} className="product-card cursor-pointer hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
                      <Link to={`/products/${product.id}`} className="block">
                        <div className="aspect-w-16 aspect-h-12 relative">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700">
                              {product.category_name}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1 mr-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">4.5</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-orange-600">
                              ${product.price}
                            </span>
                            <Button 
                              size="sm" 
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs"
                              data-testid={`add-to-cart-${product.id}`}
                              onClick={(e) => e.preventDefault()} // Prevent card navigation when clicking button
                            >
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Stock: {product.stock} units
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ) : (
                    <Card key={product.id} className="product-card cursor-pointer hover:shadow-lg transition-shadow" data-testid={`product-list-${product.id}`}>
                      <Link to={`/products/${product.id}`} className="block">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-32 h-32 flex-shrink-0">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {product.name}
                                </h3>
                                <Badge variant="secondary" className="ml-2">
                                  {product.category_name}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">
                                {product.description}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <span className="font-bold text-xl text-orange-600">
                                    ${product.price}
                                  </span>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-500 ml-1">4.5 (128 reviews)</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    Stock: {product.stock}
                                  </span>
                                </div>
                                <Button 
                                  className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                                  data-testid={`add-to-cart-list-${product.id}`}
                                  onClick={(e) => e.preventDefault()} // Prevent card navigation when clicking button
                                >
                                  <ShoppingBag className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;