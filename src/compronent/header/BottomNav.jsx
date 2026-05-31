"use client";

import { cn } from "@/src/utlis/utils";
import { Badge } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import {
  ChevronRight,
  Home,
  Info,
  Menu,
  Newspaper,
  Phone,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const BottomNav = ({ cartCount = 0, menuCategories = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const navItems = [
    { icon: Home, href: "/", key: "home", label: "Home" },
    { icon: ShoppingBag, href: "/shop", key: "shop", label: "Shop" },
    { icon: Newspaper, href: "/blog", key: "blog", label: "Blog" },
    { icon: Phone, href: "/contact", key: "contact", label: "Contact" },
    { icon: Info, href: "/about", key: "about", label: "About" },
    {
      icon: ShoppingCart,
      href: "/addtocart",
      key: "cart",
      label: "Cart",
      badge: String(cartCount),
    },
    { icon: Menu, key: "menu", label: "Categories" },
  ];

  const handleClick = (item) => {
    if (item.key === "menu") {
      setMenuOpen((prev) => !prev);
      setActiveCategory(null);
    } else if (item.href) {
      router.push(item.href);
      setMenuOpen(false);
      setActiveCategory(null);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory?.id === category.id ? null : category);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    const categorySlug = category.slug || category.name;
    const subcategorySlug = subcategory.slug || subcategory.name;
    router.push(
      `/shop?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(subcategorySlug)}`,
    );
    setMenuOpen(false);
    setActiveCategory(null);
  };

  const isActive = (item) => {
    if (item.key === "menu") return menuOpen;

    return item.href === pathname;
  };

  return (
    <>
      {/* Modern Floating Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden w-full flex justify-center pointer-events-none">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-gray-900/80 via-black/60 to-gray-800/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(30,144,255,0.18),0_1.5px_8px_0_rgba(30,144,255,0.1)] p-2.5 sm:py-2 relative overflow-visible pointer-events-auto grid grid-cols-7 place-items-center w-[98vw] max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <button
                key={item.key}
                onClick={() => handleClick(item)}
                type="button"
                title={item.label}
                aria-pressed={active}
                aria-label={item.label}
                className={cn(
                  "group flex flex-col items-center justify-center flex-1 transition-all duration-200 text-white space-y-1",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center transition-all duration-200 size-8 sm:size-10 rounded-xl active:scale-95",
                    {
                      "size-12 sm:size-14 rounded-full bg-white/30 backdrop-blur-md shadow-lg border-4 border-white/20 scale-110 hover:scale-125 active:scale-100 -mt-4":
                        active,
                    },
                  )}
                >
                  {item.badge !== undefined ? (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          minWidth: "18px",
                          height: "18px",
                        },
                      }}
                    >
                      <Icon className={"size-6 sm:size-7"} strokeWidth={2.2} />
                    </Badge>
                  ) : (
                    <Icon className={"size-6 sm:size-7"} strokeWidth={2.2} />
                  )}
                </span>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Panel */}
      <Drawer
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          setActiveCategory(null);
        }}
        anchor="right"
      >
        <div className="w-[300px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-100 to-teal-100">
            <h3 className="font-bold text-slate-800">Shop by Category</h3>
            <button
              onClick={() => {
                setMenuOpen(false);
                setActiveCategory(null);
              }}
              type="button"
              title="Close"
              aria-label="Close"
              className="p-1.5 rounded-full hover:bg-white/70"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Categories */}
          {menuCategories.length === 0 ? (
            <p className="text-center py-10 text-slate-400">
              No categories found
            </p>
          ) : (
            <div className="overflow-y-auto h-[calc(100vh-56px)]">
              {menuCategories.map((category) => {
                const isExpanded = activeCategory?.id === category.id;
                const hasSubs = category?.subcategories?.length > 0;

                return (
                  <>
                    <button
                      key={category.id}
                      onClick={() =>
                        hasSubs
                          ? handleCategoryClick(category)
                          : router.push(`/shop?category=${category.slug}`)
                      }
                      type="button"
                      title={category.name}
                      aria-pressed={isExpanded}
                      aria-label={category.name}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-4 text-left transition-colors",
                        {
                          "bg-emerald-50 text-emerald-700": isExpanded,
                          "hover:bg-slate-50": !isExpanded,
                        },
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {hasSubs && (
                        <ChevronRight
                          className={cn("w-5 h-5 transition-transform", {
                            "rotate-90": isExpanded,
                          })}
                        />
                      )}
                    </button>

                    {isExpanded && hasSubs && (
                      <div className="bg-slate-50 px-4 py-2 space-y-1">
                        {category?.subcategories?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategoryClick(category, sub)}
                            type="button"
                            title={sub.name}
                            aria-label={sub.name}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:text-emerald-600 transition-all flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>
      {/* Important: Bottom padding for mobile */}
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
};

export default BottomNav;
