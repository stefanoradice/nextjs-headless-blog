'use client';

import { /* useEffect,  */ useState } from 'react';
import Link from 'next/link';
import { fallbackMenu } from '@/lib/staticMenu';
//import { fetchMenuBySlug } from '@/lib/api/client';

export default function Menu() {
  const [menu, setMenu] = useState(fallbackMenu);

  /*  
  // Uncomment this to fetch menu from API
  useEffect(() => {
      fetchMenuBySlug().then((data) => {
        if (data) setMenu(data);
      });
    }, []); 
    */

  return (
    <nav className="main-menu" role="navigation">
      <ul className="flex gap-4">
        {menu.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
