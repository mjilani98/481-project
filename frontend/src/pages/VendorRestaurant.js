import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI, menuAPI } from '../services/api';

function VendorRestaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    category: ''
  });

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    loadRestaurant();
  }, []);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantAPI.getVendorRestaurant();
      if (!data.error) {
        setRestaurant(data);
        setMenuItems(data.menuItems || []);
      } else {
        // No restaurant yet
        setShowRestaurantForm(true);
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await restaurantAPI.create(restaurantForm);
      if (!response.error) {
        alert('Restaurant created successfully!');
        loadRestaurant();
        setShowRestaurantForm(false);
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert('Failed to create restaurant');
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...menuForm,
        restaurant_id: restaurant.id,
        price: parseFloat(menuForm.price)
      };

      let response;
      if (editingItem) {
        response = await menuAPI.update(editingItem.id, data);
      } else {
        response = await menuAPI.create(data);
      }

      if (!response.error) {
        alert(editingItem ? 'Menu item updated!' : 'Menu item added!');
        loadRestaurant();
        setShowMenuForm(false);
        setEditingItem(null);
        setMenuForm({ name: '', description: '', price: '', category: '' });
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert('Failed to save menu item');
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || ''
    });
    setShowMenuForm(true);
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await menuAPI.delete(id);
      if (!response.error) {
        alert('Menu item deleted!');
        loadRestaurant();
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert('Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await menuAPI.update(item.id, {
        is_available: item.is_available ? 0 : 1
      });
      if (!response.error) {
        loadRestaurant();
      }
    } catch (error) {
      alert('Failed to update availability');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  // Show restaurant creation form if no restaurant
  if (showRestaurantForm && !restaurant) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Create Your Restaurant</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        <div style={styles.formContainer}>
          <h2>Restaurant Details</h2>
          <form onSubmit={handleCreateRestaurant}>
            <div style={styles.formGroup}>
              <label>Restaurant Name:</label>
              <input
                type="text"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Description:</label>
              <textarea
                value={restaurantForm.description}
                onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})}
                style={styles.textarea}
                placeholder="Describe your restaurant..."
              />
            </div>

            <div style={styles.formGroup}>
              <label>Category:</label>
              <input
                type="text"
                value={restaurantForm.category}
                onChange={(e) => setRestaurantForm({...restaurantForm, category: e.target.value})}
                style={styles.input}
                placeholder="e.g., Pizza, Burgers, Chinese..."
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Create Restaurant
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Restaurant</h1>
        <div>
          <button onClick={() => navigate('/vendor/dashboard')} style={styles.navBtn}>
            View Orders
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Restaurant Info */}
        {restaurant && (
          <div style={styles.section}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
            <p><strong>Category:</strong> {restaurant.category}</p>
          </div>
        )}
        
        {!restaurant && !loading && (
          <div style={styles.section}>
            <p>Loading restaurant information...</p>
          </div>
        )}

        {/* Menu Management */}
        {restaurant && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Menu Items</h2>
              <button 
                onClick={() => {
                  setShowMenuForm(true);
                  setEditingItem(null);
                  setMenuForm({ name: '', description: '', price: '', category: '' });
                }} 
                style={styles.addBtn}
              >
                Add Menu Item
              </button>
            </div>

          {showMenuForm && (
            <div style={styles.formContainer}>
              <h3>{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
              <form onSubmit={handleCreateMenuItem}>
                <div style={styles.formGroup}>
                  <label>Item Name:</label>
                  <input
                    type="text"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Description:</label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Category:</label>
                  <input
                    type="text"
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                    style={styles.input}
                    placeholder="e.g., Main, Sides, Drinks..."
                  />
                </div>

                <div style={styles.formActions}>
                  <button type="submit" style={styles.submitBtn}>
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowMenuForm(false);
                      setEditingItem(null);
                    }} 
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {menuItems.length === 0 ? (
            <p>No menu items yet. Add your first item!</p>
          ) : (
            <div style={styles.menuGrid}>
              {menuItems.map((item) => (
                <div key={item.id} style={styles.menuCard}>
                  <div style={styles.menuCardHeader}>
                    <h3>{item.name}</h3>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: item.is_available ? '#28a745' : '#dc3545'
                    }}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p>{item.description}</p>
                  <p style={styles.price}>${item.price.toFixed(2)}</p>
                  {item.category && <p style={styles.category}>Category: {item.category}</p>}
                  
                  <div style={styles.menuActions}>
                    <button 
                      onClick={() => handleToggleAvailability(item)}
                      style={styles.toggleBtn}
                    >
                      {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button 
                      onClick={() => handleEditMenuItem(item)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMenuItem(item.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
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
  navBtn: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
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
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '80px',
    fontFamily: 'inherit'
  },
  formActions: {
    display: 'flex',
    gap: '10px'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  menuCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'white'
  },
  menuCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold'
  },
  price: {
    color: '#28a745',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  category: {
    color: '#6c757d',
    fontSize: '14px',
    marginBottom: '10px'
  },
  menuActions: {
    display: 'flex',
    gap: '5px',
    marginTop: '15px',
    flexWrap: 'wrap'
  },
  toggleBtn: {
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

export default VendorRestaurant;
