import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

type TableDataProps = {
    accounts: string[];
};

const TableData: React.FC<TableDataProps> = ({ accounts }) => {
    const { t } = useTranslation();
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCopySelected = () => {
        navigator.clipboard.writeText(selectedAccounts.join('\n'));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedAccounts([]);
        } else {
            setSelectedAccounts(accounts);
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (account: string) => {
        if (selectedAccounts.includes(account)) {
            setSelectedAccounts(selectedAccounts.filter(item => item !== account));
        } else {
            setSelectedAccounts([...selectedAccounts, account]);
        }
    };

    return (
        <>
            <div className="flex items-center gap-x-3 mb-3">
                {selectedAccounts.length > 0 && (
                    <Button
                        className="text-white bg-teal-500 hover:bg-teal-500/80"
                        onClick={handleCopySelected}
                    >
                        <ClipboardIcon size={18} className="me-1" /> {t('copy')}
                    </Button>
                )}
                {selectedAccounts.length > 0 && `Copy ${selectedAccounts.length} account${selectedAccounts.length > 1 ? 's' : ''}`}
            </div>
            <Table className="rounded-2xl bg-gray-100 dark:bg-slate-900">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8">
                            <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                        </TableHead>
                        <TableHead className="w-full text-center">{t('account')}</TableHead>
                        <TableHead>{t('action')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium text-center dark:text-white">
                                <Checkbox
                                    checked={selectedAccounts.includes(item)}
                                    onCheckedChange={() => handleSelect(item)}
                                />
                            </TableCell>
                            <TableCell className="text-center dark:text-white">
                                <Textarea cols={1} defaultValue={item} className="min-h-4" readOnly />
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    className="text-white bg-teal-500 hover:bg-teal-500/80"
                                    onClick={() => handleCopy(item)}
                                >
                                    <ClipboardIcon size={18} className="me-1" /> {t('copy')}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default TableData;
