"use client";

import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E1E1E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#D4AF37",
    },
    background: {
      default: "#121212",
      paper: "rgba(30,30,30,0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      letterSpacing: "0.05em",
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          padding: "12px 24px",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #212121 30%, #424242 90%)",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30,30,30,0.8)",
          padding: "20px",
          borderRadius: "16px",
          backdropFilter: "blur(6px)",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },
  },
});

const Providers = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Providers;
