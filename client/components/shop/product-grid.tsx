import { ProductCard } from "./product-card";

const products = [
  {
    id: "1",
    name: "Wireless Over-Ear Headphones",
    price: "₹4,999",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    alt: "Wireless over-ear headphones in matte black",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Minimalist Running Shoes",
    price: "₹6,499",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    alt: "White and red minimalist running shoes",
    category: "Fashion",
  },
  {
    id: "3",
    name: "Ceramic Table Lamp",
    price: "₹2,299",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
    alt: "Modern ceramic table lamp",
    category: "Home",
  },
  {
    id: "4",
    name: "Smart Watch Pro",
    price: "₹12,999",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    alt: "Smart watch with black strap and round face",
    category: "Electronics",
  },
  {
    id: "5",
    name: "Organic Cotton T-Shirt",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    alt: "Plain organic cotton t-shirt in heather grey",
    category: "Fashion",
  },
  {
    id: "6",
    name: "Wooden Desk Organiser",
    price: "₹1,799",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop",
    alt: "Wooden desk organiser with compartments",
    category: "Home",
  },
];

export function ProductGrid() {
  return (
    <ul
      className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
    >
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
            alt={p.alt}
            category={p.category}
            index={i}
          />
        </li>
      ))}
    </ul>
  );
}
