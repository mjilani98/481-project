import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, restaurant } = location.state || {};
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart || cart.length === 0) {
    return (
      <div style={styles.container}>
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/home')} style={styles.button}>
          Go to Home
        </button>
      </div>
    );
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderData = {
      restaurant_id: restaurant.id,
      items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      })),
      delivery_address: deliveryAddress,
      notes: notes
    };

    try {
      const response = await orderAPI.create(orderData);
      
      if (response.error) {
        setError(response.error);
      } else {
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <h1>Checkout</h1>

      <div style={styles.content}>
        <div style={styles.orderSection}>
          <h2>Order Summary</h2>
          <p><strong>Restaurant:</strong> {restaurant.name}</p>
          
          <div style={styles.itemsList}>
            {cart.map((item) => (
              <div key={item.id} style={styles.item}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={styles.total}>
            <strong>Total: ${getTotalPrice()}</strong>
          </div>
        </div>

        <div style={styles.formSection}>
          <h2>Delivery Details</h2>
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Delivery Address:</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                style={styles.textarea}
                placeholder="Enter your delivery address"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Special Instructions (Optional):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
                placeholder="Any special requests?"
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  },
  orderSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px'
  },
  itemsList: {
    marginTop: '15px'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  total: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid #ddd',
    fontSize: '20px'
  },
  formSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontFamily: 'inherit'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};

export default Checkout;
