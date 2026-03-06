import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import MainRouter from './routers/MainRouter';
import { AuthProvider } from './utils/AuthProvider';
import { ToastProvider } from './context/ToastProvider';
import { ThemeProvider } from './context/ThemeProvider';
// import { AuthProvider } from './context/AuthContext';
 
ReactDOM.createRoot(document.getElementById('root')).render(
      <AuthProvider>
            <ThemeProvider>
                  <ToastProvider>
                        <RouterProvider router={MainRouter} />
                  </ToastProvider>
            </ThemeProvider>
      </AuthProvider>
);
