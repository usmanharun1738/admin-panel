// -----------------------------------------------------------------------------
// StatusBadge – Renders a colored tag for order status.
// Accepts a status string and optionally a size.
// -----------------------------------------------------------------------------

import { Tag } from 'antd';
import type { Order } from '../types';

interface StatusBadgeProps {
    status: Order['status']; // 'pending' | 'paid' | 'shipped' | 'delivered'
    size?: 'small' | 'default' | 'large';
}

// Map status to color and label
const statusMap: Record<Order['status'], { color: string; label: string }> = {
    pending: { color: 'orange', label: 'Pending' },
    paid: { color: 'blue', label: 'Paid' },
    shipped: { color: 'cyan', label: 'Shipped' },
    delivered: { color: 'green', label: 'Delivered' },
};

export const StatusBadge = ({ status, size = 'default' }: StatusBadgeProps) => {
    const { color, label } = statusMap[status] || { color: 'default', label: status };
    return (
        <Tag color={color} style={{ fontSize: size === 'small' ? '12px' : '14px' }}>
            {label}
        </Tag>
    );
};