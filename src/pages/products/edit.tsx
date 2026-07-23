// -----------------------------------------------------------------------------
// Product Edit – Form to update an existing product.
// Uses Refine's useForm with the `id` from the URL.
// -----------------------------------------------------------------------------

import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber } from 'antd';

export const ProductEdit = () => {
    // useForm fetches the product by ID and handles updates.
    const { formProps, saveButtonProps, queryResult } = useForm({
        resource: 'products',
        // id is automatically taken from URL
    });

    // You can access the fetched product data if needed
    // const productData = queryResult?.data?.data;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Product name is required' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={3} placeholder="Enter product description" />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        { required: true, message: 'Price is required' },
                        { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.01}
                        placeholder="0.00"
                        prefix="$"
                    />
                </Form.Item>

                <Form.Item
                    label="Stock Quantity"
                    name="stock_quantity"
                    rules={[
                        { required: true, message: 'Stock quantity is required' },
                        { type: 'number', min: 0, message: 'Stock cannot be negative' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1}
                        placeholder="0"
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};