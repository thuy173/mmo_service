import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTranslation } from 'react-i18next';

type SelectDaysRangeProps = {
    selectedItem: string;
    onSelect: (value: string) => void;
};

const SelectDaysRange: React.FC<SelectDaysRangeProps> = ({ selectedItem, onSelect }) => {
    const { t } = useTranslation();

    // Function to calculate the number of days from today back to the start of the week (Monday)
    const getDaysFromTodayToMonday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysBackToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return daysBackToMonday + 1;
    };

    // Function to calculate the number of days from today back to the first day of the current month
    const getDaysFromTodayToFirstOfMonth = () => {
        const today = new Date();
        return today.getDate();
    };

    // Event handler for when a SelectItem is clicked
    const handleSelect = (value: string) => {
        onSelect(value);
    };

    return (
        <Select value={selectedItem} onValueChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="0">{t('all')}</SelectItem>
                    <SelectItem value="1">{t('today')}</SelectItem>
                    <SelectItem value={getDaysFromTodayToMonday().toString()}>{t('thisWeek')}</SelectItem>
                    <SelectItem value={getDaysFromTodayToFirstOfMonth().toString()}>{t('thisMonth')}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectDaysRange;
