import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import productCategoryService from "@/services/productCategoryService"
import { ProductCategory } from "@/models/productCategory"
import { PaymentMethod } from "@/models/paymentMethod"
import paymentMethodService from "@/services/paymentMethodService"
import { useTranslation } from "react-i18next"

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                const data = await productCategoryService.getAllProductCategories();
                setProductCategories(data)
            } catch (error) {
                console.error(error)
            }
        }

        const fetchPaymentMethods = async () => {
            try {
                const data = await paymentMethodService.getAllPaymentMethods();
                setPaymentMethods(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchProductCategories()
        fetchPaymentMethods()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center border-t py-2">
            <div className="flex gap-3">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-3">
                        <NavigationMenuItem>
                            <Link to="/" className={navigationMenuTriggerStyle()}>
                                {t('navbar.home')}
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="relative">
                            <NavigationMenuTrigger>{t('products')}</NavigationMenuTrigger>
                            <NavigationMenuContent className="absolute left-1/2 transform -translate-x-1/2">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[800px] ">
                                    {productCategories.map((item) => (
                                        <li key={item.id}>
                                            <div className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors")}>
                                                <div className="text-lg font-medium border-b pb-3">{item.name}</div>
                                                <div className="flex flex-col">
                                                    {item.subProductCategories.map((subItem) => (
                                                        <Link key={subItem.name} to={`/product/category/${subItem.id}`} className="flex items-center gap-1 p-3 border-l-[3px] rounded-r-md hover:border-black hover:bg-accent hover:text-accent-foreground">
                                                            <FontAwesomeIcon icon={faSquareFacebook} className="w-6 h-6" />
                                                            <span>{subItem.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-3">
                        <NavigationMenuItem className="relative">
                            <NavigationMenuTrigger>{t('navbar.topUp')}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="flex flex-col w-[200px] gap-2 p-2">
                                    {paymentMethods.map((item) => (
                                        <li key={item.id} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-3">
                        <NavigationMenuItem className="relative">
                            <NavigationMenuTrigger>{t('navbar.history')}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="flex flex-col w-[200px] gap-2 p-2">
                                    <Link to={'/order-history'} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                        <span>{t('navbar.orderHistory')}</span>
                                    </Link>
                                    <Link to={'/activity-log'} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                        <span>{t('navbar.activityLog')}</span>
                                    </Link>
                                    <Link to={'/profile/transactions'} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                        <span>{t('navbar.transactions')}</span>
                                    </Link>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/blogs" className={navigationMenuTriggerStyle()}>
                                {t('navbar.blogs')}
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

export default Navbar
