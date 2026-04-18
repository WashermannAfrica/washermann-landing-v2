"use client";

import { createContext, useContext, useState } from "react";

interface MenuContextValue {
  megaOpen: boolean;
  setMegaOpen: (v: boolean) => void;
}

const MenuContext = createContext<MenuContextValue>({
  megaOpen: false,
  setMegaOpen: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [megaOpen, setMegaOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ megaOpen, setMegaOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
