import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Car } from "../database/models/Car";
import { database } from "../database";

interface CarContextData {
  cars: Car[];
  loading: boolean;
}

interface CarProviderProps {
  children: ReactNode;
}
const CarContext = createContext<CarContextData>({} as CarContextData);

function CarProvider({ children }: CarProviderProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCars() {
    try {
      const cars = await database.get<Car>("cars").query().fetch();
      setCars(cars);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <CarContext.Provider value={{ cars, loading }}>
      {children}
    </CarContext.Provider>
  );
}

function useCar(): CarContextData {
  const context = useContext(CarContext);
  return context;
}

export { CarProvider, useCar };
