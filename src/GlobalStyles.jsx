// src/GlobalStyles.jsx (or directly in App.jsx if preferred)
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif; /* You might want to import a font like Inter from Google Fonts */
    background-color: #0d1117; /* Matches hero background */
    color: #c9d1d9; /* Default text color */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export default GlobalStyles;