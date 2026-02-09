import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  // State for price input and result
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State for product management
  const [activeTab, setActiveTab] = useState('calculate'); // 'calculate' or 'product'
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [searchName, setSearchName] = useState('');
  const [productResult, setProductResult] = useState(null);
  const [productError, setProductError] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  
  // State for autocomplete
  const [allProducts, setAllProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Function to calculate IVA via backend API
  const calculateIVA = async () => {
    // Validate input
    if (!price || price.trim() === '') {
      setError('Please enter a price');
      setResult(null);
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Please enter a valid price');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/calculate-iva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: numericPrice }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setError('');
      } else {
        setError(data.error || 'Error calculating IVA');
        setResult(null);
      }
    } catch (err) {
      setError('Connection error with server');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const clearForm = () => {
    setPrice('');
    setResult(null);
    setError('');
  };

  // Save product to database
  const saveProduct = async () => {
    if (!productName || productName.trim() === '') {
      setProductError('Please enter a product name');
      return;
    }
    if (!productPrice || productPrice.trim() === '') {
      setProductError('Please enter a product price');
      return;
    }

    const numericPrice = parseFloat(productPrice);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setProductError('Please enter a valid price');
      return;
    }

    setProductLoading(true);
    setProductError('');
  
        // Refresh product list
        const productsResponse = await fetch(`${API_URL}/api/products`);
        if (productsResponse.ok) {
          const data = await productsResponse.json();
          setAllProducts(data);
        }
      
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: productName, price: numericPrice }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product saved successfully!');
        setProductName('');
        setProductPrice('');
        setProductError('');
      } else {
        setProductError(data.error || 'Error saving product');
      }
    } catch (err) {
      setProductError('Connection error with server');
    } finally {
      setProductLoading(false);
    }
  };

  // Search product and calculate tax
  const searchProduct = async () => {
    if (!searchName || searchName.trim() === '') {
      setProductError('Please enter a product name to search');
      setProductResult(null);
      return;
    }

    setProductLoading(true);
    setProductError('');

    try {
      const response = await fetch(`${API_URL}/api/products/search/${encodeURIComponent(searchName)}`);
      const data = await response.json();

      if (response.ok) {
        setProductResult(data);
        setProductError('');
      } else {
        setProductError(data.error || 'Product not found');
        setProductResult(null);
      }
    } catch (err) {
      setProductError('Connection error with server');
      setProductResult(null);
    } finally {
      setProductLoading(false);
    }
  };

  const clearProductSearch = () => {
    setSearchName('');
    setProductResult(null);
    setProductError('');
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  // Handle search input change with autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);

    if (value.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter products that match the search term
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (productName) => {
    setSearchName(productName);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  return (
    <div className="app-container">
      <div className="calculator-card">
        <h1>IVA Calculator</h1>
        <p className="subtitle">15% IVA</p>

        {/* Tab Navigation */}
        <div className="tab-container">
          <button 
            className={`tab ${activeTab === 'calculate' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculate')}
          >
            Calculate IVA
          </button>
          <button 
            className={`tab ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => setActiveTab('product')}
          >
            Find Product
          </button>
        </div>

        {/* Calculate IVA Tab */}
        {activeTab === 'calculate' && (
          <>
            <div className="input-group">
              <label htmlFor="price">Product Price ($)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter the price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="button-group">
              <button 
                onClick={calculateIVA} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Calculating...' : 'Calculate IVA'}
              </button>
              <button 
                onClick={clearForm}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {result && (
              <div className="result-container">
                <h2>Result</h2>
                <div className="result-item">
                  <span className="label">Price:</span>
                  <span className="value">${result.price.toFixed(2)}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">IVA ({result.ivaPercentage}%):</span>
                  <span className="value">${result.ivaValue.toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Product Search Tab */}
        {activeTab === 'product' && (
          <>
            <div className="section-title">Save Product</div>
            <div className="input-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="productPrice">Product Price ($)</label>
              <input
                type="number"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Enter product price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="button-group">
              <button 
                onClick={saveProduct} 
                disabled={productLoading}
                className="btn-primary"
              >
                {productLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>

            <div className="divider"></div>

            <div className="section-title">Find Product & See Tax</div>
            <div className="input-group autocomplete-container">
              <label htmlFor="searchName">Search Product Name</label>
              <input
                type="text"
                id="searchName"
                value={searchName}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (filteredSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Enter product name"
                autoComplete="off"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {filteredSuggestions.map((product) => (
                    <li
                      key={product._id}
                      onClick={() => handleSuggestionClick(product.name)}
                      className="suggestion-item"
                    >
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-price">${product.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="button-group">
              <button 
                onClick={searchProduct} 
                disabled={productLoading}
                className="btn-primary"
              >
                {productLoading ? 'Searching...' : 'Search Product'}
              </button>
              <button 
                onClick={clearProductSearch}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>

            {productError && (
              <div className="error-message">
                {productError}
              </div>
            )}

            {productResult && (
              <div className="result-container">
                <h2>Product Found</h2>
                <div className="result-item">
                  <span className="label">Product:</span>
                  <span className="value">{productResult.product.name}</span>
                </div>
                <div className="result-item">
                  <span className="label">Price:</span>
                  <span className="value">${productResult.product.price.toFixed(2)}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Tax/IVA ({productResult.ivaPercentage}%):</span>
                  <span className="value">${productResult.ivaValue.toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}

        <footer className="footer">
          <p>Developed by Blacio - ESPE 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
