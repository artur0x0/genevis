import React, { useEffect, useState } from 'react';

const VisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState(null);
  
    useEffect(() => {
      const fetchVisitorCount = async () => {
        try {
          const response = await fetch('/api/visitor-count');
          const data = await response.json();
          setVisitorCount(data.count);
  
          // Increment visitor count
          await fetch('/api/visitor-count', { method: 'POST' });
        } catch (error) {
          console.error('Error fetching visitor count:', error);
        }
      };
  
      fetchVisitorCount();
    }, []);
  };

export default VisitorCounter;
