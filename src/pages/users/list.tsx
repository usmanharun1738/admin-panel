import { useTable } from '@refinedev/antd';
import { List, Table, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { User } from '../../types';

export const UserList = () => {
    const { tableProps } = useTable<User>({
        resource: 'users',
        sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    });

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
            render: (value: string) => (
                <Space>
                    <UserOutlined />
                    {value}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
        },
        {
            title: 'Admin',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (value: boolean) => (
                <Tag color={value ? 'gold' : 'default'}>
                    {value ? 'Admin' : 'User'}
                </Tag>
            ),
            filters: [
                { text: 'Admin', value: true },
                { text: 'User', value: false },
            ],
            onFilter: (value: boolean | React.Key, record:User ) => record.is_admin === value,
        },
        {
            title: 'Joined At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
            sorter: true,
        },
    ];

    return (
        <List>
            <Table {...tableProps} columns={columns} rowKey="id" />
        </List>
    );
};