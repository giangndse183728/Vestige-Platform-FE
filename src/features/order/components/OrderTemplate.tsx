import React from 'react';
import { formatVNDPrice, formatDate } from '@/utils/format';

interface OrderTemplateProps {
  order: any;
}

const OrderTemplate: React.FC<OrderTemplateProps> = ({ order }) => {
  if (!order) return null;
  // Collect unique sellers
  const sellers = Object.values(order.itemsBySeller)
    .flat()
    .map((item: any) => item.seller)
    .reduce((acc: any[], seller: any) => {
      if (!acc.find((s) => s.userId === seller.userId)) acc.push(seller);
      return acc;
    }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#fff', color: '#222', padding: 32, width: 800, fontFamily: 'serif', margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Order #{order.orderId}</h2>
        <div style={{ marginBottom: 16 }}>
          <strong>Status:</strong> {order.status}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Total Amount:</strong> {formatVNDPrice(order.totalAmount)}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Order Date:</strong> {formatDate(order.createdAt)}
        </div>
        {order.deliveredAt && (
          <div style={{ marginBottom: 16 }}>
            <strong>Delivered At:</strong> {formatDate(order.deliveredAt)}
          </div>
        )}
        <hr style={{ margin: '24px 0' }} />
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Product</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Qty</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Price</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Seller</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(order.itemsBySeller).flat().map((item: any) => (
              <tr key={item.orderItemId}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.product.title}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>1</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{formatVNDPrice(item.price)}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.seller.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginBottom: 16 }}>
          <strong>Shipping Fee:</strong> {formatVNDPrice(order.totalShippingFee)}
        </div>
        {/* Seller usernames only */}
        <hr style={{ margin: '24px 0' }} />
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Seller(s)</h3>
        <ul style={{ marginBottom: 24, paddingLeft: 0, listStyle: 'none', fontSize: 16 }}>
          {sellers.map((seller: any) => (
            <li key={seller.userId} style={{ marginBottom: 4 }}>
              {seller.username}
            </li>
          ))}
        </ul>
        <hr style={{ margin: '24px 0' }} />
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Buyer Information</h3>
        <div style={{ marginBottom: 8 }}><strong>Name:</strong> {order.buyer.firstName} {order.buyer.lastName} (@{order.buyer.username})</div>
        <div style={{ marginBottom: 8 }}><strong>Email:</strong> {order.buyer.email}</div>
        <div style={{ marginBottom: 8 }}><strong>Phone:</strong> {order.buyer.phoneNumber}</div>
        <hr style={{ margin: '24px 0' }} />
        {order.shippingAddress && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Shipping Address</h3>
            <div>{order.shippingAddress.addressLine1}</div>
            {order.shippingAddress.addressLine2 && <div>{order.shippingAddress.addressLine2}</div>}
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
            <div>{order.shippingAddress.country}</div>
          </>
        )}
        <div style={{ marginTop: 48, textAlign: 'right', fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>
          Signature: <span className="font-metal" style={{  fontSize: 24, color: '#7f1d1d' }}>VES</span><span className="font-metal"  style={{  fontSize: 24 }}>TIGE</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTemplate;
