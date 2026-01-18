#!/bin/bash

echo "======================================"
echo "PLOS Articles Search - Installation"
echo "======================================"
echo ""

# Install Backend
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Backend installation failed"
    exit 1
fi
cd ..

echo ""

# Install Frontend
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Frontend installation failed"
    exit 1
fi
cd ..

echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "To run the application:"
echo ""
echo "1. Start Backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Start Frontend (in new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open browser at: http://localhost:4200"
echo ""
