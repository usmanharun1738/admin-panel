import { useNavigation, useUpdate } from '@refinedev/core';
import { useTable } from '@refinedev/antd'; // ✅ Import from @refinedev/antd
import { List, Table, Space, Button, Dropdown, Menu, message } from 'antd';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons';
import type { Order } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const OrderList = () => {
    const { tableProps } = useTable<Order>({
        resource: 'orders',
        sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    });

    const { show } = useNavigation();
    const { mutate: updateStatus, mutation } = useUpdate<Order>();
    const isUpdating = mutation.isPending;

    const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
        updateStatus(
            {
                resource: 'orders',
                id: orderId,
                values: { status: newStatus },
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
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Paid', value: 'paid' },
                { text: 'Shipped', value: 'shipped' },
                { text: 'Delivered', value: 'delivered' },
            ],
            onFilter: (value: boolean | React.Key, record: Order) => record.status === value,
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
            render: (_: unknown, record: Order) => (
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
        <List>
            <Table {...tableProps} columns={columns} rowKey="id" />
        </List>
    );
};