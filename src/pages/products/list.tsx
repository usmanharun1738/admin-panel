// -----------------------------------------------------------------------------
// Product List – Shows all products in a table with edit/delete actions.
// Uses Refine's useTable hook for data fetching, sorting, pagination.
// -----------------------------------------------------------------------------

import { useNavigation, useDelete } from '@refinedev/core';
import { useTable } from '@refinedev/antd';
import { List, Table, Space, Button, Tag, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import type { Product } from '../../types';

export const ProductList = () => {
    const { tableProps } = useTable<Product>({ resource: 'products' });
    const { edit } = useNavigation();
    const { mutate: deleteProduct } = useDelete();

    const handleDelete = (id: number) => {
        deleteProduct(
            {
                resource: 'products',
                id,
            },
            {
                onSuccess: () => {
                    message.success('Product deleted successfully');
                },
                onError: () => {
                    message.error('Failed to delete product');
                },
            }
        );
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (value: string) =>
                value ? (
                    <img src={value} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                    <PictureOutlined style={{ fontSize: 20, color: '#d9d9d9' }} />
                ),
            width: 60,
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
            render: (_: unknown, record: Product) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => edit('products', record.id)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete product"
                        description="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
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