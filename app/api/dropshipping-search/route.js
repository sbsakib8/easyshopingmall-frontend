import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5004/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const { skyTitle, tags, page = 1, limit = 50 } = body;

    const searchQuery = skyTitle || tags || "";

    const res = await fetch(`${backendUrl}/products/search-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skyTitle, tags, page, limit }),
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Backend search failed" }, { status: res.status });
    }

    const json = await res.json();
    const products = json.data || [];

    const q = searchQuery.trim().toLowerCase();

    const titleMatches = [];
    const skyMatches = [];

    products.forEach((product) => {
      const name = String(product.productName || "").toLowerCase();
      const subcategory = String(product.subcategory?.name || product.subcategory || "").toLowerCase();
      const category = String(product.category?.name || product.category || "").toLowerCase();
      const skyTitle = String(product.skyTitle || "").toLowerCase();

      if (name.includes(q) || subcategory.includes(q) || category.includes(q)) {
        titleMatches.push(product);
      } else if (skyTitle.includes(q)) {
        skyMatches.push(product);
      } else {
        skyMatches.push(product);
      }
    });

    return NextResponse.json({
      data: products,
      titleMatches,
      skyMatches,
      total: products.length,
    });
  } catch (error) {
    console.error("Dropshipping search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
