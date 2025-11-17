import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

function StudentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderAPI.getStudentOrders();
      if (!data.error) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#ffc107', color: 'black' },
      confirmed: { backgroundColor: '#17a2b8', color: 'white' },
      preparing: { backgroundColor: '#fd7e14', color: 'white' },
      ready: { backgroundColor: '#28a745', color: 'white' },
      delivered: { backgroundColor: '#6c757d', color: 'white' },
      cancelled: { backgroundColor: '#dc3545', color: 'white' }
    };
    return styles[status] || {};
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/home')} style={styles.backBtn}>
        ← Back to Home
      </button>

      <h1>My Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={styles.emptyState}>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/home')} style={styles.button}>
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3>{order.restaurant_name}</h3>
                  <p style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span style={{ ...styles.status, ...getStatusStyle(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div style={styles.orderItems}>
                <h4>Items:</h4>
                {order.items.map((item) => (
                  <div key={item.id} style={styles.item}>
                    <span>{item.item_name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={styles.orderFooter}>
                <strong>Total: ${order.total_amount.toFixed(2)}</strong>
              </div>

              {order.delivery_address && (
                <p style={styles.address}>
                  <strong>Delivery Address:</strong> {order.delivery_address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px'
  },
  ordersList: {
    display: 'grid',
    gap: '20px'
  },
  orderCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  orderDate: {
    color: '#6c757d',
    fontSize: '14px',
    marginTop: '5px'
  },
  status: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  orderItems: {
    marginBottom: '15px'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0'
  },
  orderFooter: {
    paddingTop: '15px',
    borderTop: '2px solid #ddd',
    fontSize: '18px'
  },
  address: {
    marginTop: '10px',
    color: '#6c757d',
    fontSize: '14px'
  }
};

export default StudentOrders;
