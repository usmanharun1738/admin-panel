import { Refine, Authenticated } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemedLayout, useNotificationProvider, AuthPage } from '@refinedev/antd';

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

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          authProvider={authProvider}
          dataProvider={dataProvider()}
          routerProvider={routerProvider}
          notificationProvider={useNotificationProvider}
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
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
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
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;