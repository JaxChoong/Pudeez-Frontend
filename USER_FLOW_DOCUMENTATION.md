# Pudeez Frontend - User Flow Diagrams & Documentation

## Overview
This document provides detailed user flows for each page in the Pudeez Frontend application. Use this as a reference when creating Figma diagrams.

## Application Structure

### Main Navigation Routes
```
/ (Landing)
├── /marketplace (Browse & Search Items)
├── /profile (User Profile & Steam Integration)
├── /inventory (User's Steam Items)
├── /cart (Shopping Cart)
├── /escrow (Escrow Transactions)
├── /sign-up (Steam Account Connection)
└── Dynamic Routes:
    ├── /view/:assetId (Item Details)
    ├── /buy/:assetId (Purchase Flow)
    ├── /sell/:assetId (List Item for Sale)
    └── /escrow/view/:transactionId (Escrow Details)
```

---

## 1. LANDING PAGE USER FLOW

### Entry Points
- Direct URL access
- External referrals
- Marketing campaigns

### User Journey
```
┌─────────────────┐
│   LANDING PAGE  │
└─────┬───────────┘
      │
      ├─ View Hero Section
      │  ├─ "CYBERPUNK STEAM MARKETPLACE"
      │  └─ Key value propositions
      │
      ├─ Browse Featured Items
      │  ├─ Popular Steam items carousel
      │  └─ Interactive item previews
      │
      ├─ View Features Section
      │  ├─ Steam Integration
      │  ├─ Secure Trading
      │  ├─ Rare Items
      │  └─ Community Market
      │
      ├─ View Statistics
      │  ├─ Total Volume: 2.5M SUI
      │  ├─ Active Traders: 150K+
      │  ├─ Items Listed: 500K+
      │  └─ Games Supported: 100+
      │
      └─ Call-to-Action
         ├─ "BROWSE ITEMS" → /marketplace
         └─ "CONNECT STEAM" → /sign-up
```

### Key Actions
- **Primary CTA**: Browse Items (→ Marketplace)
- **Secondary CTA**: Connect Steam (→ Sign Up)
- **Featured Items**: Click to view details

---

## 2. MARKETPLACE PAGE USER FLOW

### Entry Points
- Landing page CTA
- Navigation menu
- Direct URL

### User Journey
```
┌─────────────────┐
│  MARKETPLACE    │
└─────┬───────────┘
      │
      ├─ Search & Filter
      │  ├─ Text search bar
      │  ├─ Game filter dropdown
      │  ├─ Genre selection
      │  └─ View mode (Grid/List)
      │
      ├─ Browse Items
      │  ├─ All Items tab
      │  └─ Buy Now Items tab
      │
      ├─ Item Actions (per item)
      │  ├─ View Details → /view/:assetId
      │  ├─ Buy Now → /buy/:assetId
      │  ├─ Place Bid → /bid/:assetId
      │  └─ AI Analysis (planned)
      │
      └─ Pagination
         └─ Load more items
```

### Key Features
- **Dynamic Filtering**: Real-time search and game filtering
- **Dual View Modes**: Grid and List layouts
- **Action Buttons**: Buy/Bid based on item type
- **Steam Integration**: Display Steam item details

---

## 3. INVENTORY PAGE USER FLOW

### Entry Points
- Profile page
- Navigation menu
- Sell flow redirect

### User Journey
```
┌─────────────────┐
│   INVENTORY     │
└─────┬───────────┘
      │
      ├─ Game Selection
      │  ├─ Dropdown with supported games
      │  └─ Auto-populate from Steam API
      │
      ├─ Inventory Tabs
      │  ├─ All Items (Steam inventory)
      │  └─ On Sale (currently listed)
      │
      ├─ Item Management (per item)
      │  ├─ View Details → /view/:assetId
      │  ├─ List for Sale → /sell/:assetId
      │  └─ Edit Listing (if on sale)
      │
      └─ Steam Integration
         ├─ Fetch inventory data
         ├─ Display item rarity/condition
         └─ Show market values
```

### Key Features
- **Steam API Integration**: Real-time inventory sync
- **Multi-tab Interface**: Organized item categories
- **Quick Actions**: Direct selling from inventory

---

## 4. ITEM DETAILS PAGE USER FLOW

### Entry Points
- Marketplace item click
- Inventory item view
- Direct asset URL

### User Journey
```
┌─────────────────┐
│  ITEM DETAILS   │
└─────┬───────────┘
      │
      ├─ Item Information
      │  ├─ High-res image
      │  ├─ Item name & game
      │  ├─ Rarity & condition
      │  ├─ Description
      │  └─ Steam market data
      │
      ├─ Pricing Information
      │  ├─ Current price
      │  ├─ Price history
      │  └─ Market comparison
      │
      ├─ Seller Information
      │  ├─ Seller profile
      │  ├─ Rating/reputation
      │  └─ Contact options
      │
      └─ Action Buttons
         ├─ Buy Now → /buy/:assetId
         ├─ Place Bid → /bid/:assetId
         ├─ Add to Cart → /cart
         └─ Share item
```

### Key Features
- **Comprehensive Details**: All item metadata
- **Visual Focus**: Large, high-quality images
- **Trust Indicators**: Seller reputation, authenticity

---

## 5. BUY FLOW USER FLOW

### Entry Points
- Marketplace "Buy" button
- Item details "Buy Now"
- Cart checkout

### User Journey
```
┌─────────────────┐
│   BUY MODAL     │
└─────┬───────────┘
      │
      ├─ Purchase Summary
      │  ├─ Item details recap
      │  ├─ Price breakdown
      │  ├─ Steam trade URL input
      │  └─ Total cost calculation
      │
      ├─ Steam Trade Setup
      │  ├─ Trade URL validation
      │  ├─ Trade instructions
      │  └─ Security warnings
      │
      ├─ Payment Confirmation
      │  ├─ Wallet connection check
      │  ├─ Balance verification
      │  └─ Gas fee estimate
      │
      └─ Action Buttons
         ├─ Confirm Purchase → Escrow creation
         ├─ Cancel → Close modal
         └─ Edit Details → Modify trade URL
```

### Key Features
- **Modal Interface**: Overlay purchase flow
- **Steam Integration**: Trade URL handling
- **Blockchain Transaction**: Smart contract interaction

---

## 6. SELL FLOW USER FLOW

### Entry Points
- Inventory "Sell" button
- Navigation to sell page
- Direct URL with asset

### User Journey
```
┌─────────────────┐
│   SELL PAGE     │
└─────┬───────────┘
      │
      ├─ Item Preview
      │  ├─ Asset image & details
      │  ├─ Steam market value
      │  └─ Condition/rarity info
      │
      │
      ├─ Pricing Setup
      │  ├─ Sale Price (fixed)
      │  └─ Description field
      │
      ├─ Validation
      │  ├─ Wallet connection
      │  ├─ Asset ownership
      │  └─ Price reasonability
      │
      └─ Action Buttons
         ├─ List Item → Create listing
         ├─ Cancel → /inventory
         └─ Preview → Show listing preview
```

### Key Features
- **Smart Validation**: Ownership and pricing checks
- **Rich Preview**: Show how listing will appear

---

## 7. ESCROW SYSTEM USER FLOW

### Main Escrow Page
```
┌─────────────────┐
│  ESCROW PAGE    │
└─────┬───────────┘
      │
      ├─ Transaction Overview
      │  ├─ Total transactions count
      │  ├─ In Progress count
      │  ├─ Completed count
      │  └─ Cancelled count
      │
      ├─ Filter Tabs
      │  ├─ In Progress transactions
      │  ├─ Completed transactions
      │  └─ Cancelled transactions
      │
      ├─ Transaction List (per transaction)
      │  ├─ Item thumbnail & name
      │  ├─ Transaction amount
      │  ├─ Buyer/Seller addresses
      │  ├─ Status badge
      │  ├─ Creation date
      │  └─ "View Details" button
      │
      └─ Navigation
         └─ View Details → /escrow/view/:transactionId
```

### Escrow Detail Page
```
┌─────────────────┐
│ ESCROW DETAILS  │
└─────┬───────────┘
      │
      ├─ Transaction Header
      │  ├─ Transaction ID
      │  ├─ Status badge
      │  └─ Back button
      │
      ├─ Item Details Card
      │  ├─ Item image & name
      │  ├─ Game information
      │  ├─ Rarity & condition
      │  └─ Item description
      │
      ├─ Transaction Info Card
      │  ├─ Amount & currency
      │  ├─ Buyer address (copyable)
      │  ├─ Seller address (copyable)
      │  ├─ Escrow contract address
      │  ├─ Creation & update dates
      │  └─ Steam trade URL link
      │
      ├─ Transaction Timeline
      │  ├─ Escrow created
      │  ├─ Funds deposited
      │  ├─ Seller notified
      │  └─ Additional events
      │
      └─ External Links
         ├─ Steam trade URL
         └─ Blockchain explorer
```

---

## 8. PROFILE PAGE USER FLOW

### Entry Points
- Navigation menu
- User account dropdown
- Steam authentication redirect

### User Journey
```
┌─────────────────┐
│  PROFILE PAGE   │
└─────┬───────────┘
      │
      ├─ User Information
      │  ├─ Steam profile data
      │  ├─ Wallet address
      │  ├─ Join date
      │  └─ Trading statistics
      │
      ├─ Steam Integration
      │  ├─ Connection status
      │  ├─ Profile verification
      │  └─ Re-authentication option
      │
      ├─ Trading History
      │  ├─ Recent transactions
      │  ├─ Total volume traded
      │  └─ Success rate
      │
      └─ Quick Actions
         ├─ View Inventory → /inventory
         ├─ Browse Marketplace → /marketplace
         └─ Manage Escrows → /escrow
```

---

## 9. CART PAGE USER FLOW

### Entry Points
- Add to cart from marketplace
- Add to cart from item details
- Cart icon in navigation

### User Journey
```
┌─────────────────┐
│   CART PAGE     │
└─────┬───────────┘
      │
      ├─ Cart Items List
      │  ├─ Item thumbnail & details
      │  ├─ Quantity controls
      │  ├─ Individual prices
      │  └─ Remove item option
      │
      ├─ Price Summary
      │  ├─ Subtotal calculation
      │  ├─ Estimated gas fees
      │  ├─ Total amount
      │  └─ Currency conversion
      │
      ├─ Security Notice
      │  ├─ Blockchain protection info
      │  └─ Terms & conditions
      │
      └─ Checkout Actions
         ├─ Proceed to Purchase
         ├─ Continue Shopping → /marketplace
         └─ Clear Cart
```

---

## 10. AUTHENTICATION FLOW

### Steam Sign-Up Process
```
┌─────────────────┐
│   SIGN UP       │
└─────┬───────────┘
      │
      ├─ Steam Authentication
      │  ├─ Redirect to Steam OpenID
      │  ├─ User authorizes app
      │  └─ Return with profile data
      │
      ├─ Profile Setup
      │  ├─ Display Steam profile
      │  ├─ Wallet connection prompt
      │  └─ Terms acceptance
      │
      └─ Completion
         ├─ Account created
         ├─ Session established
         └─ Redirect to marketplace
```

---

## Common UI Patterns

### Navigation Bar
- Logo (→ Landing)
- Marketplace link
- Profile dropdown
- Wallet connection status
- Cart icon with count

### Loading States
- Shimmer effects for images
- Skeleton loaders for lists
- Spinner overlays for actions

### Error Handling
- Connection errors
- API failures
- Validation messages
- Retry mechanisms

### Responsive Design
- Mobile-first approach
- Tablet breakpoints
- Desktop optimizations
- Touch-friendly interactions

---

## Key User Journeys

### First-Time User
1. Landing Page → Learn about platform
2. Sign Up → Connect Steam account
3. Marketplace → Browse available items
4. Buy Flow → Make first purchase

### Returning Seller
1. Profile → Check trading stats
2. Inventory → Select items to sell
3. Sell Flow → Create listings
4. Escrow → Monitor transactions

### Active Trader
1. Marketplace → Find deals
2. Multiple Buy/Bid flows
3. Cart → Batch purchases
4. Escrow → Track all transactions

This documentation provides the foundation for creating detailed Figma diagrams. Each section can be expanded into individual user flow diagrams with specific UI states, interactions, and transitions.
