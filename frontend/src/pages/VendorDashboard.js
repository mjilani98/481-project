import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

function VendorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderAPI.getVendorOrders();
      if (!data.error) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, newStatus);
      if (!response.error) {
        // Reload orders
        loadOrders();
        alert('Order status updated successfully');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Vendor Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.name}!</span>
          <button onClick={() => navigate('/vendor/restaurant')} style={styles.restaurantBtn}>
            Manage Restaurant
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.filterSection}>
          <h2>Order Management</h2>
          <div style={styles.filters}>
            <button 
              onClick={() => setFilter('all')} 
              style={filter === 'all' ? styles.activeFilter : styles.filterBtn}
            >
              All ({orders.length})
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              style={filter === 'pending' ? styles.activeFilter : styles.filterBtn}
            >
              Pending ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button 
              onClick={() => setFilter('confirmed')} 
              style={filter === 'confirmed' ? styles.activeFilter : styles.filterBtn}
            >
              Confirmed ({orders.filter(o => o.status === 'confirmed').length})
            </button>
            <button 
              onClick={() => setFilter('preparing')} 
              style={filter === 'preparing' ? styles.activeFilter : styles.filterBtn}
            >
              Preparing ({orders.filter(o => o.status === 'preparing').length})
            </button>
            <button 
              onClick={() => setFilter('ready')} 
              style={filter === 'ready' ? styles.activeFilter : styles.filterBtn}
            >
              Ready ({orders.filter(o => o.status === 'ready').length})
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No {filter !== 'all' ? filter : ''} orders found.</p>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p style={styles.orderDate}>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p style={styles.customerInfo}>
                      Customer: {order.student_name} | Phone: {order.student_phone || 'N/A'}
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

                {order.notes && (
                  <p style={styles.notes}>
                    <strong>Notes:</strong> {order.notes}
                  </p>
                )}

                <div style={styles.actions}>
                  <h4>Update Status:</h4>
                  <div style={styles.actionButtons}>
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          style={styles.confirmBtn}
                        >
                          Confirm Order
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          style={styles.cancelBtn}
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        style={styles.preparingBtn}
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        style={styles.readyBtn}
                      >
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        style={styles.deliveredBtn}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  restaurantBtn: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activeFilter: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center'
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
  customerInfo: {
    color: '#495057',
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
    fontSize: '18px',
    marginBottom: '15px'
  },
  address: {
    marginTop: '10px',
    color: '#6c757d',
    fontSize: '14px'
  },
  notes: {
    marginTop: '10px',
    color: '#6c757d',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  actions: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  confirmBtn: {
    padding: '10px 20px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  preparingBtn: {
    padding: '10px 20px',
    backgroundColor: '#fd7e14',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  readyBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deliveredBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default VendorDashboard;
