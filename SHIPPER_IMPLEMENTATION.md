# Vestige Shipping: Frontend Implementation

This document outlines the implementation of the Vestige Shipping system for the frontend, including the shipper role functionality and seller pickup requests.

## Overview

The Vestige Shipping system replaces the old shipping process with an in-house logistics system managed by users with a SHIPPER role. This creates a fully traceable, end-to-end delivery process with enhanced security through photo evidence.

## New Order Flow

1. **Seller Requests Pickup**: After an item is paid for (PROCESSING), the seller packs it and requests a pickup from Vestige.
2. **Shipper Scans & Confirms Pickup**: A Vestige shipper arrives, scans a QR code provided by the seller, and uploads photos of the package as proof of condition. The item is now IN_WAREHOUSE.
3. **Shipper Dispatches**: The shipper begins the delivery route. The item is now OUT_FOR_DELIVERY.
4. **Shipper Confirms Delivery**: The shipper delivers the package and uploads photos as proof of delivery. The item is now DELIVERED, and the seller's payment is released from escrow.

## New Order Statuses

The following new order statuses have been added to the system:

- `AWAITING_PICKUP`: Item is ready for pickup by shipper
- `IN_WAREHOUSE`: Item has been picked up and is in the warehouse
- `OUT_FOR_DELIVERY`: Item is on its way to the buyer

## Implementation Details

### 1. Updated Schema (`src/features/order/schema.ts`)

- Added new order statuses to `orderStatusEnum`
- Added logistics schemas for shipper functionality:
  - `pickupItemSchema`
  - `pickupListResponseSchema`
  - `confirmPickupRequestSchema`
  - `confirmDeliveryRequestSchema`

### 2. New API Services (`src/features/order/services.ts`)

Added logistics services for shippers:
- `requestPickup(orderId, itemId)`: For sellers to request pickup
- `getPickupList()`: For shippers to get pending pickups
- `confirmPickup(itemId, photoUrls)`: For shippers to confirm pickup with photos
- `dispatchItem(itemId)`: For shippers to dispatch items for delivery
- `confirmDelivery(itemId, photoUrls)`: For shippers to confirm delivery with photos

### 3. Shipper App (`src/app/shipper/`)

#### Layout (`src/app/shipper/layout.tsx`)
- Authentication check for SHIPPER role
- Navigation between pickup list and delivery route
- User information display

#### Main Dashboard (`src/app/shipper/page.tsx`)
- Displays list of items awaiting pickup
- Shows product details, seller info, and pickup address
- "Start Pickup" button to begin pickup process

#### Pickup Confirmation (`src/app/shipper/pickup/[itemId]/page.tsx`)
- QR code scanning simulation
- Photo upload for package condition proof
- Confirmation process with API integration

#### Delivery Route (`src/app/shipper/delivery/page.tsx`)
- Shows items in warehouse ready for dispatch
- Shows items out for delivery
- Bulk dispatch functionality
- Individual dispatch options

#### Delivery Confirmation (`src/app/shipper/delivery/[itemId]/page.tsx`)
- Photo upload for delivery proof
- Confirmation process with API integration

### 4. Seller Order Management (`src/features/order/components/SellerOrderManagement.tsx`)

New component for sellers with enhanced functionality:
- "Request Pickup" button for PROCESSING items
- QR code display for AWAITING_PICKUP items
- Status timeline for shipping progress
- Integration with pickup request API

### 5. Updated Order Components

Updated existing order components to support new statuses:
- `OrderDetail.tsx`: Added new status configurations
- `BuyerOrdersTab.tsx`: Added new status configurations
- `CustomerOrdersTab.tsx`: Added new status configurations

### 6. QR Code Component (`src/components/ui/qr-code.tsx`)

Simple QR code generation component for pickup functionality:
- Canvas-based QR code generation
- Configurable size
- Basic pattern generation based on item ID

## Usage Instructions

### For Sellers

1. **Request Pickup**: When an item has status "PROCESSING", click "Request Pickup"
2. **Show QR Code**: When status changes to "AWAITING_PICKUP", click "Show Pickup QR Code"
3. **Track Progress**: Monitor status changes through the shipping timeline

### For Shippers

1. **Login**: Use an account with SHIPPER role
2. **View Pickups**: Check the pickup list for items awaiting collection
3. **Start Pickup**: Click "Start Pickup" and follow the confirmation process
4. **Scan QR**: Scan the seller's QR code (simulated)
5. **Take Photos**: Upload photos of the package condition
6. **Confirm Pickup**: Complete the pickup process
7. **Dispatch Items**: Move items from warehouse to delivery route
8. **Confirm Delivery**: Take delivery photos and confirm delivery

## API Endpoints

### For Sellers
- `POST /api/orders/{orderId}/items/{itemId}/request-pickup`

### For Shippers
- `GET /api/logistics/pickups`
- `POST /api/logistics/items/{itemId}/confirm-pickup`
- `POST /api/logistics/items/{itemId}/dispatch`
- `POST /api/logistics/items/{itemId}/confirm-delivery`

## Security Features

- Role-based access control (SHIPPER role required)
- Photo evidence for pickup and delivery
- QR code verification for pickup confirmation
- Escrow payment release only after delivery confirmation

## Future Enhancements

1. **Real QR Code Library**: Replace simple QR generation with a proper library
2. **Camera Integration**: Real camera access for photo capture
3. **GPS Tracking**: Location tracking for delivery verification
4. **Push Notifications**: Real-time updates for status changes
5. **Route Optimization**: Optimize delivery routes for multiple items
6. **Signature Capture**: Digital signatures for delivery confirmation

## Testing

To test the shipper functionality:

1. Create a user account with SHIPPER role
2. Create test orders with PROCESSING status
3. Use the seller interface to request pickups
4. Use the shipper interface to process pickups and deliveries
5. Verify status changes throughout the process

## Notes

- Photo upload currently uses data URLs (in production, upload to Firebase Storage first)
- QR code scanning is simulated (in production, use device camera)
- Error handling includes user-friendly messages and retry mechanisms
- All components follow the existing design system and styling patterns 