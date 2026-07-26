// -----------------------------------------------------------------------------
// Product List – Shows all products in a table with edit/delete actions.
// Uses Refine's useTable hook for data fetching, sorting, pagination.
// -----------------------------------------------------------------------------

import { useNavigation } from '@refinedev/core';
import { useTable } from '@refinedev/antd';
import { List, Table, Space, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Product } from '../../types';

export const ProductList = () => {
    const { tableProps } = useTable<Product>({ resource: 'products' });
    const { edit, create } = useNavigation();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (value: number) => `$${value.toFixed(2)}`,
            sorter: true,
        },
        {
            title: 'Stock',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
            render: (value: number) => (
                <Tag color={value > 10 ? 'green' : value > 0 ? 'orange' : 'red'}>
                    {value}
                </Tag>
            ),
            sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) => new Date(value).toLocaleDateString(),
            sorter: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_:unknown, record: Product) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => edit('products', record.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => {
                            // Delete logic can be added here using useDelete hook
                        }}
                    >
                        Delete
                    </Button>
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