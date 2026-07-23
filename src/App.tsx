// -----------------------------------------------------------------------------
// Admin Panel – Main Application Entry
// Configures Refine with data provider, auth provider, router, and resources.
// -----------------------------------------------------------------------------

import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AntdLayout, useNotificationProvider } from '@refinedev/antd';

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
          // Authentication provider – handles login/logout
          authProvider={authProvider}
          // Data provider – communicates with your Go backend
          dataProvider={dataProvider()}
          // Router provider – integrates react-router-v6
          routerProvider={routerProvider}
          // Notification provider – Ant Design notifications
          notificationProvider={useNotificationProvider}
          // Resources – define the main entities of the admin panel
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
          // Options
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
          // Layout – uses Ant Design's layout with sidebar and header
          Layout={AntdLayout}
          // Default title and favicon
          Title={() => <span style={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</span>}
        // Sider (sidebar) – customisation can be added here
        >
          <Routes>
            {/* Dashboard – root path */}
            <Route path="/" element={<Dashboard />} />

            {/* Products */}
            <Route path="/products">
              <Route index element={<ProductList />} />
              <Route path="create" element={<ProductCreate />} />
              <Route path="edit/:id" element={<ProductEdit />} />
            </Route>

            {/* Orders */}
            <Route path="/orders">
              <Route index element={<OrderList />} />
              <Route path="show/:id" element={<OrderShow />} />
            </Route>

            {/* Users */}
            <Route path="/users">
              <Route index element={<UserList />} />
            </Route>
          </Routes>

          {/* Global command palette (Ctrl+K) */}
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;