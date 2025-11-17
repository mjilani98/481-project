import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantAPI.getById(id);
      if (!data.error) {
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing.quantity === 1) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout', { state: { cart, restaurant } });
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (!restaurant) return <div style={styles.container}>Restaurant not found</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/home')} style={styles.backBtn}>
        ← Back to Restaurants
      </button>

      <header style={styles.header}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
      </header>

      <div style={styles.content}>
        <div style={styles.menuSection}>
          <h2>Menu Items</h2>
          {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
            <div style={styles.menuGrid}>
              {restaurant.menuItems.map((item) => (
                <div key={item.id} style={styles.menuCard}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p style={styles.price}>${item.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(item)} style={styles.addBtn}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No menu items available</p>
          )}
        </div>

        {cart.length > 0 && (
          <div style={styles.cartSection}>
            <h2>Your Cart</h2>
            {cart.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <div>
                  <strong>{item.name}</strong>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div style={styles.cartActions}>
                  <button onClick={() => removeFromCart(item.id)} style={styles.cartBtn}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={styles.cartBtn}>+</button>
                </div>
              </div>
            ))}
            <div style={styles.cartTotal}>
              <strong>Total: ${getTotalPrice()}</strong>
            </div>
            <button onClick={handleCheckout} style={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
          </div>
        )}
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
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px'
  },
  menuSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  menuCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '6px'
  },
  price: {
    color: '#28a745',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  addBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cartSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  cartActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  cartBtn: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cartTotal: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid #ddd',
    fontSize: '18px'
  },
  checkoutBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '16px'
  }
};

export default RestaurantMenu;
