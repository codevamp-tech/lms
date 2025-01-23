import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const DarkMode = () => {
  const { theme, setTheme } = useTheme(); // Ensure this hook provides the current theme and a function to update it.

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};

export default DarkMode;
