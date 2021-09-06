import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

const otherSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
export const getSizes = () => {
    const allSizes: any[] = [];
    for (let i = 4; i < 14; i += 0.5) {
        allSizes.push(
            <Option value={i.toString()} key={i.toString()}>
                {i.toString()}
            </Option>,
        );
    }

    otherSizes.forEach((size) => {
        allSizes.push(
            <Option value={size} key={size}>
                {size}
            </Option>,
        );
    });
    return allSizes;
};
