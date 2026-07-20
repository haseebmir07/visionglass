import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Newspaper } from 'lucide-react';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
        { name: 'Blogs', path: '/seller/blogs', lucideIcon: Newspaper },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                // Blog routes are nested (e.g. /seller/blogs/new), so highlight
                // the Blogs item for any path under /seller/blogs.
                const isActive =
                    item.path === '/seller/blogs'
                        ? pathname.startsWith('/seller/blogs')
                        : pathname === item.path;

                const LucideIcon = item.lucideIcon;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            {LucideIcon ? (
                                <LucideIcon className="w-7 h-7 text-gray-600" strokeWidth={1.5} />
                            ) : (
                                <Image
                                    src={item.icon}
                                    alt={`${item.name.toLowerCase()}_icon`}
                                    className="w-7 h-7"
                                />
                            )}
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
