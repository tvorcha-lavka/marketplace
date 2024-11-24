import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { ModalProvider } from './hooks/useModal';
import { setupAxiosInterceptors } from './redux/axiosConfig.js';
import App from './App.jsx';
import 'modern-normalize';
import theme from './styles/theme.js';
import GlobalStylesComponent from './styles/GlobalStyles';
import './index.css';

setupAxiosInterceptors();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ModalProvider>
          <ThemeProvider theme={theme}>
            <GlobalStylesComponent />
            <App />
          </ThemeProvider>
        </ModalProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
