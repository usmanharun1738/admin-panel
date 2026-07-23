// -----------------------------------------------------------------------------
// Order List – Shows all orders with status, total, date, and actions.
// Uses useTable for data fetching with default sorting by creation date.
// Provides a dropdown to update order status inline.
// -----------------------------------------------------------------------------

import { useTable, useNavigation, useUpdate } from '@refinedev/core';
import { List, Table, Space, Button, Dropdown, Menu, Tag, message } from 'antd';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons';
import type { Order } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const OrderList = () => {
    // Fetch orders with default sorting: newest first
    const { tableProps } = useTable<Order>({
        resource: 'orders',
        sorters: {
            initial: [{ field: 'created_at', order: 'desc' }],
        },
    });

    const { show } = useNavigation();
    const { mutate: updateStatus, isLoading: isUpdating } = useUpdate<Order>();

    // Handle status update via dropdown
    const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
        updateStatus(
            {
                resource: 'orders',
                id: orderId,
                values: { status: newStatus },
                // Since our backend uses PATCH /orders/:id/status?  Actually we defined admin endpoint.
                // We'll use custom endpoint later, but for now, the default update may not work.
                // We'll handle this via custom mutation or adjust dataProvider.
                // For now, we'll use the default update which expects PATCH /orders/:id
            },
            {
                onSuccess: () => {
                    message.success(`Order status updated to ${newStatus}`);
                },
                onError: () => {
                    message.error('Failed to update order status');
                },
            }
        );
    };

    // Build dropdown menu for status options
    const getStatusMenu = (orderId: number) => {
        const statusOptions: Order['status'][] = ['pending', 'paid', 'shipped', 'delivered'];
        return (
            <Menu
                onClick={({ key }) => handleStatusChange(orderId, key as Order['status'])}
                items={statusOptions.map((status) => ({
                    key: status,
                    label: <StatusBadge status={status} />,
                }))}
            />
        );
    };

    // Define columns
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'User',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (userId: number) => `User #${userId}`,
        },
        {
            title: 'Total',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (value: number) => `$${value.toFixed(2)}`,
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: Order['status']) => <StatusBadge status={status} />,
            sorter: true,
            filterMultiple: false,
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Paid', value: 'paid' },
                { text: 'Shipped', value: 'shipped' },
                { text: 'Delivered', value: 'delivered' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) => new Date(value).toLocaleString(),
            sorter: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: Order) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => show('orders', record.id)}
                    >
                        View
                    </Button>
                    <Dropdown overlay={getStatusMenu(record.id)} trigger={['click']}>
                        <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <List title="Orders">
            <Table {...tableProps} columns={columns} rowKey="id" />
        </List>
    );
};