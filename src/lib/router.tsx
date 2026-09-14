import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type RouteContextType = {
  path: string;
  navigate: (to: string) => void;
};

const RouteContext = createContext<RouteContextType>({
  path: '/',
  navigate: () => {},
});

export function RouteProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setPath(hash || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return (
    <RouteContext.Provider value={{ path, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouteContext);
}
