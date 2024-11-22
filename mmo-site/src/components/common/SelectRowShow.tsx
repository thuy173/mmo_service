import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type SelectRowShowProps = {
    selectedItem: string;
    onSelect: (value: string) => void;
};

const SelectRowShow: React.FC<SelectRowShowProps> = ({ selectedItem, onSelect }) => {
    const handleSelect = (value: string) => {
        onSelect(value);
    };

    return (
        <Select value={selectedItem} onValueChange={handleSelect}>
            <SelectTrigger className="w-[80px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectRowShow;
