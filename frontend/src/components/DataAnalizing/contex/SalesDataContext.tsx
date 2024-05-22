import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BACKEND } from '../../../utils/linkt';

interface SalesData {
  month: string;
  orders_count: number;
}

interface SalesDataContextType {
  salesData: SalesData[];
}

interface SalesDataProviderProps {
    children: ReactNode;
  }

const SalesDataContext = createContext<SalesDataContextType | undefined>(undefined);

export const SalesDataProvider: React.FC<SalesDataProviderProps> = ({ children }:any) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/analizing`);
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SalesDataContext.Provider value={{ salesData }}>
      {children}
    </SalesDataContext.Provider>
  );
};

export const useSalesData = () => {
  const context = useContext(SalesDataContext);
  if (context === undefined) {
    throw new Error('useSalesData must be used within a SalesDataProvider');
  }
  return context;
};
