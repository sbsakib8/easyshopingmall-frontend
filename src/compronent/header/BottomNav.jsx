"use client";

import { cn } from "@/src/utlis/utils";
import {
  AddShoppingCart,
  GridView,
  HomeFilled,
  Info,
  MailRounded,
  NewspaperRounded,
  ShopRounded,
} from "@mui/icons-material";
import { Badge } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { ChevronRight, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const BottomNav = ({ cartCount = 0, menuCategories = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const navItems = [
    { icon: HomeFilled, href: "/", key: "home", label: "Home" },
    { icon: NewspaperRounded, href: "/blog", key: "blog", label: "Blog" },
    {
      icon: AddShoppingCart,
      href: "/addtocart",
      key: "cart",
      label: "Cart",
      badge: String(cartCount),
    },
    { icon: ShopRounded, href: "/shop", key: "shop", label: "Shop" },
    { icon: MailRounded, href: "/contact", key: "contact", label: "Contact" },
    { icon: Info, href: "/about", key: "about", label: "About" },
    { icon: GridView, key: "menu", label: "Category" },
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 md:hidden w-full flex justify-center pointer-events-none">
        <div className="rounded-tr-2xl rounded-tl-2xl bg-gradient-to-r from-slate-300/80 via-white/30 to-slate-400/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(30,144,255,0.18),0_1.5px_8px_0_rgba(30,144,255,0.1)] px-3.5 py-2.5 relative overflow-visible pointer-events-auto grid grid-cols-8 place-items-center w-full max-w-lg mx-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item);
            const shopButton = item.key === "shop";

            return (
              <button
                key={item.key}
                onClick={() => handleClick(item)}
                type="button"
                title={item.label}
                aria-pressed={active}
                aria-label={item.label}
                className={cn(
                  "group flex flex-col items-center justify-between flex-1 transition-all duration-200 h-full",
                  {
                    "col-span-2 w-3/5 mx-auto relative justify-end": shopButton,
                  },
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center transition-all duration-200 active:scale-95 relative",
                    {
                      "size-17 sm:size-20! absolute -top-12 sm:-top-14 rounded-full p-3 overflow-hidden":
                        shopButton,
                    },
                  )}
                >
                  {/* Running Gradient Border */}
                  {shopButton && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {/* Animated Running Border */}
                      <div
                        className="absolute inset-[-4px] rounded-full
                   bg-[conic-gradient(transparent_0deg,transparent_85deg,#10b981_115deg,#34d399_165deg,#6ee7b7_205deg,#34d399_245deg,transparent_300deg,transparent_360deg)]
                   animate-[spin_2.8s_linear_infinite]
                   blur-[1.5px]"
                      />

                      {/* Inner Glass Background - Perfectly Circular */}
                      <div
                        className="absolute inset-[3px] rounded-full
                      bg-gradient-to-r from-slate-300/80 via-white/70 to-slate-400/80
                      backdrop-blur-md"
                      />
                    </div>
                  )}

                  {/* Icon Container with Z-index */}
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {item.badge !== undefined ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "12px",
                            minWidth: "16px",
                            height: "16px",
                          },
                        }}
                      >
                        <Icon
                          className={cn(
                            "text-black/90 sm:text-3xl transition-transform",
                            {
                              "text-emerald-600": active,
                              "animate-[pulse_2.5s_ease-in-out_infinite]":
                                shopButton,
                            },
                          )}
                        />
                      </Badge>
                    ) : (
                      <Icon
                        className={cn(
                          "text-black/80 sm:text-3xl! transition-transform",
                          {
                            "text-emerald-500": active,
                            "text-4xl! sm:text-5xl!": shopButton,
                            "animate-[pulse_2.5s_ease-in-out_infinite]":
                              shopButton,
                          },
                        )}
                      />
                    )}
                  </div>
                </span>

                <span
                  className={cn(
                    "text-[8px] text-black sm:text-[10px] uppercase font-semibold",
                    {
                      "font-bold text-emerald-600": active,
                      relative: shopButton,
                    },
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Panel */}
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
                            onClick={() =>
                              handleSubcategoryClick(category, sub)
                            }
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
    </>
  );
};

export default BottomNav;
