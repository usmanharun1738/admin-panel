import { Refine, Authenticated } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemedLayout, useNotificationProvider, AuthPage } from '@refinedev/antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@refinedev/antd/dist/reset.css';

import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';

import {
  ProductList,
  ProductCreate,
  ProductEdit,
  OrderList,
  OrderShow,
  UserList,
  Dashboard,
} from './pages';

const CustomTitle = () => (
  <span style={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</span>
);

// Global React Query client with sensible caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds – refetch after this time
      gcTime: 5 * 60 * 1000, // 5 minutes – keep in memory
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <QueryClientProvider client={queryClient}>
        <Refine
          authProvider={authProvider}
          dataProvider={dataProvider()}
          routerProvider={routerProvider}
          notificationProvider={useNotificationProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
          resources={[
            {
              name: 'dashboard',
              list: '/',
              meta: { label: 'Dashboard' },
            },
            {
              name: 'products',
              list: '/products',
              create: '/products/create',
              edit: '/products/edit/:id',
              meta: { label: 'Products' },
            },
            {
              name: 'orders',
              list: '/orders',
              show: '/orders/show/:id',
              meta: { label: 'Orders' },
            },
            {
              name: 'users',
              list: '/users',
              meta: { label: 'Users' },
            },
          ]}
        >
          <Routes>
            {/* Login route – public */}
            <Route path="/login" element={<AuthPage type="login" />} />

            {/* Protected routes with authentication guard */}
            <Route
              element={
                <Authenticated key="authenticated-layout" fallback={<Navigate to="/login" replace />}>
                  <ThemedLayout Title={CustomTitle}>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/products">
                <Route index element={<ProductList />} />
                <Route path="create" element={<ProductCreate />} />
                <Route path="edit/:id" element={<ProductEdit />} />
              </Route>
              <Route path="/orders">
                <Route index element={<OrderList />} />
                <Route path="show/:id" element={<OrderShow />} />
              </Route>
              <Route path="/users">
                <Route index element={<UserList />} />
              </Route>
            </Route>

            {/* Catch‑all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <RefineKbar />
        </Refine>
      </QueryClientProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;