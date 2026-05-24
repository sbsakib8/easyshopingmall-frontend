"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Info,
  Newspaper,
  Phone,
  ShoppingCart,
  Menu,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "@mui/material";
import { cn } from "@/src/utlis/utils";
import Drawer from "@mui/material/Drawer";

const BottomNav = ({ cartCount = 0, menuCategories = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [menuOpen]);

  // Lock scroll
  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

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
    { icon: Menu, key: "menu", label: "Menu" },
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

  const handleSubcategoryClick = (subcategory) => {
    router.push(
      `/shop?category=${subcategory.categoryId.slug}&subcategory=${subcategory.slug}`,
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
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-lg">
        <div className="relative flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
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
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-95 w-14 h-14",
                  active
                    ? "text-emerald-500"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
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
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </Badge>
                ) : (
                  <Icon className="w-6 h-6" strokeWidth={2.2} />
                )}
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
                            onClick={() => handleSubcategoryClick(sub)}
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
