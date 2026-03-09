import { createContext, useContext, useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';

const OrderContext = createContext(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.list();
        if (data) setOrders(data);
      } catch (err) {
        console.warn('Backend not available for orders:', err.message);
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('wrongman-orders');
          if (saved) setOrders(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      id: `WM${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    try {
      const saved = await orderAPI.create(newOrder);
      setOrders(prev => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.warn('API order save failed, saving locally:', err.message);
      setOrders(prev => [newOrder, ...prev]);
      if (typeof window !== 'undefined') {
        const updated = [newOrder, ...orders];
        localStorage.setItem('wrongman-orders', JSON.stringify(updated));
      }
      return newOrder;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.update(orderId, { status });
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      console.warn('API order update failed, updating locally:', err.message);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{ orders, loading, createOrder, updateOrderStatus, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
};