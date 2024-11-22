import { KeyRoundIcon, UserRoundIcon, WalletIcon } from "lucide-react";

export const sideNavItems = [
    {
        title: 'Personal Information',
        icon: <UserRoundIcon size={18} />,
        href: '/profile',
    },
    {
        title: 'Transactions',
        icon: <WalletIcon size={18} />,
        href: '/profile/transactions',
    },
    {
        title: 'Change password',
        icon: <KeyRoundIcon size={18} />,
        href: '/profile/change-password',
    },
]
