import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../services/api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantAPI.getAll();
      if (!data.error) {
        setRestaurants(data);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Smart Delivery - Campus Food</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.name}!</span>
          <button onClick={() => navigate('/orders')} style={styles.ordersBtn}>
            My Orders
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h2>Available Restaurants</h2>
        
        {loading ? (
          <p>Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants available at the moment.</p>
        ) : (
          <div style={styles.restaurantGrid}>
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                style={styles.restaurantCard}
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description || 'Delicious food awaits!'}</p>
                <p style={styles.category}>{restaurant.category}</p>
                <p style={styles.vendor}>By: {restaurant.vendor_name}</p>
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
    backgroundColor: '#007bff',
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
  ordersBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
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
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  restaurantCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  category: {
    color: '#007bff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: '10px'
  },
  vendor: {
    color: '#6c757d',
    fontSize: '14px',
    marginTop: '5px'
  }
};

export default Home;
