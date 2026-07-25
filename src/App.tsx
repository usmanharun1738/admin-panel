// -----------------------------------------------------------------------------
// Admin Panel – Main Application Entry
// Configures Refine with data provider, auth provider, router, and resources.
// -----------------------------------------------------------------------------

import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemedLayout, useNotificationProvider } from '@refinedev/antd'; // ✅ Changed

import '@refinedev/antd/dist/reset.css';
import './index.css'; // optional custom styles

// Import providers
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';

// Import pages
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  OrderList,
  OrderShow,
  UserList,
  Dashboard,
} from './pages';

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
            {/* ✅ Wrap Routes inside ThemedLayoutV2 */}
            <Route
              element={
                <ThemedLayout Title={() => <span style={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</span>}>
                  <Outlet />
                </ThemedLayout>
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
          </Routes>
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;