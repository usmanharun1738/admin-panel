// -----------------------------------------------------------------------------
// Order Show – Displays full order details with user info, address, items,
// and a status update form. Uses useShow to fetch order by ID.
// -----------------------------------------------------------------------------

import { useShow, useUpdate } from '@refinedev/core';
import { Show, Descriptions, Table, Select, Button, Space, message } from 'antd';
import type { Order, OrderItem } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const OrderShow = () => {
    // Fetch order data by ID from the URL
    const { queryResult } = useShow<Order>({
        resource: 'orders',
    });
    const { data, isLoading } = queryResult;
    const order = data?.data;

    const { mutate: updateStatus, isLoading: isUpdating } = useUpdate<Order>();

    // Handle status change
    const handleStatusChange = (newStatus: Order['status']) => {
        if (!order) return;
        updateStatus(
            {
                resource: 'orders',
                id: order.id,
                values: { status: newStatus },
            },
            {
                onSuccess: () => {
                    message.success('Order status updated');
                    // Refresh data by refetching the query
                    queryResult.refetch();
                },
                onError: () => {
                    message.error('Failed to update status');
                },
            }
        );
    };

    if (isLoading) return <div>Loading order details...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <Show>
            {/* Order header information */}
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {new Date(order.created_at).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="User ID">{order.user_id}</Descriptions.Item>
                <Descriptions.Item label="Total Price">
                    ${order.total_price.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={2}>
                    <Space>
                        <StatusBadge status={order.status} />
                        <Select
                            value={order.status}
                            onChange={handleStatusChange}
                            style={{ width: 150 }}
                            loading={isUpdating}
                        >
                            {['pending', 'paid', 'shipped', 'delivered'].map((status) => (
                                <Select.Option key={status} value={status}>
                                    <StatusBadge status={status as Order['status']} />
                                </Select.Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            loading={isUpdating}
                            onClick={() => {
                                // This is optional; the select triggers update directly
                            }}
                        >
                            Update Status
                        </Button>
                    </Space>
                </Descriptions.Item>
                {/* Optionally show address details if fetched */}
                {order.address && (
                    <>
                        <Descriptions.Item label="Street">{order.address.street}</Descriptions.Item>
                        <Descriptions.Item label="City">{order.address.city}</Descriptions.Item>
                        <Descriptions.Item label="State">{order.address.state}</Descriptions.Item>
                        <Descriptions.Item label="ZIP">{order.address.zip}</Descriptions.Item>
                    </>
                )}
            </Descriptions>

            {/* Order Items Table */}
            <Table
                dataSource={order.order_items}
                rowKey="id"
                pagination={false}
                style={{ marginTop: 24 }}
                title={() => <strong>Order Items</strong>}
            >
                <Table.Column dataIndex="id" title="Item ID" />
                <Table.Column dataIndex="product_id" title="Product ID" />
                <Table.Column
                    dataIndex="quantity"
                    title="Quantity"
                />
                <Table.Column
                    dataIndex="unit_price"
                    title="Unit Price"
                    render={(value: number) => `$${value.toFixed(2)}`}
                />
                <Table.Column
                    title="Total"
                    render={(_: any, record: OrderItem) =>
                        `$${(record.unit_price * record.quantity).toFixed(2)}`
                    }
                />
            </Table>
        </Show>
    );
};