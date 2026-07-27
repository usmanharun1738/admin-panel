// -----------------------------------------------------------------------------
// Product Create – Form to add a new product.
// Uses Refine's useForm hook for form state and submission.
// -----------------------------------------------------------------------------

import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Button } from 'antd';

export const ProductCreate = () => {
    // useForm integrates with Ant Design Form and handles submission.
    const { formProps, saveButtonProps } = useForm({
        resource: 'products',
        // onSuccess: (data) => { // handle success }
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
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
                    label="Image URL"
                    name="image_url"
                >
                    <Input placeholder="https://example.com/product-image.jpg" />
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
        </Create>
    );
};