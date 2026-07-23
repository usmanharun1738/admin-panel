// -----------------------------------------------------------------------------
// Dashboard – Displays key business metrics, charts, and recent orders.
// Uses useCustom to fetch aggregated data from the backend.
// -----------------------------------------------------------------------------

import { useCustom, useList } from '@refinedev/core';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    ShoppingCartOutlined,
    DollarOutlined,
    UserOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import type { Order, User } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

// Chart colors for status distribution
const COLORS = {
    pending: '#faad14', // orange
    paid: '#1677ff',    // blue
    shipped: '#13c2c2', // cyan
    delivered: '#52c41a', // green
};

// Format currency
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

export const Dashboard = () => {
    // Fetch all orders to calculate metrics
    const { data: ordersData, isLoading: ordersLoading } = useList<Order>({
        resource: 'orders',
        pagination: { pageSize: 1000 }, // Fetch all orders for aggregation
    });

    // Fetch all users for total count
    const { data: usersData, isLoading: usersLoading } = useList<User>({
        resource: 'users',
        pagination: { pageSize: 1000 },
    });

    // Fetch recent orders (last 10) for the activity table
    const { data: recentOrders, isLoading: recentLoading } = useList<Order>({
        resource: 'orders',
        pagination: { pageSize: 10 },
        sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    });

    // Compute metrics from orders
    const orders = ordersData?.data || [];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const totalUsers = usersData?.data?.length || 0;

    // Calculate order status distribution for pie chart
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prepare data for the pie chart
    const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        status,
    }));

    // Prepare data for the revenue trend chart (group by date)
    const revenueTrend = orders
        .filter(order => order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered')
        .reduce((acc, order) => {
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            acc[date] = (acc[date] || 0) + order.total_price;
            return acc;
        }, {} as Record<string, number>);

    const trendData = Object.entries(revenueTrend)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Define columns for recent orders table
    const recentColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Total',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: Order['status']) => <StatusBadge status={status} />,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) => new Date(value).toLocaleString(),
        },
    ];

    const isLoading = ordersLoading || usersLoading || recentLoading;

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

            {/* Key Metrics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Total Orders"
                            value={totalOrders}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Total Revenue"
                            value={totalRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                            formatter={formatCurrency}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Total Users"
                            value={totalUsers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Products Sold"
                            value={orders.reduce((sum, order) => {
                                // Count total items across all orders
                                // Note: Requires order_items to be populated; we estimate from total_orders
                                return sum + (order.order_items?.length || 0);
                            }, 0)}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={14}>
                    <Card
                        title="Revenue Trend"
                        loading={isLoading}
                        style={{ height: 340 }}
                    >
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={trendData.length > 0 ? trendData : [{ date: 'No Data', amount: 0 }]}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#1677ff"
                                    fill="#1677ff"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title="Order Status Distribution"
                        loading={isLoading}
                        style={{ height: 340 }}
                    >
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={statusChartData.length > 0 ? statusChartData : [{ name: 'No Orders', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusChartData.map((entry) => (
                                        <Cell
                                            key={entry.status}
                                            fill={COLORS[entry.status as keyof typeof COLORS] || '#8884d8'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Orders Table */}
            <Card
                title="Recent Orders"
                loading={isLoading}
                style={{ marginTop: 16 }}
            >
                <Table
                    dataSource={recentOrders?.data || []}
                    columns={recentColumns}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};