import React, { useEffect, useState } from "react";
import NotifyMeForm from "./NotifyMeForm";

function App() {
  const product = window.product;
  // const product = {
  //   available: true,
  //   id: 1,
  //   name: "Product 1",
  //   price: 100,
  //   variants: [
  //     {
  //       id: 1,
  //       name: "Variant 1",
  //       price: 100,
  //     },
  //     {
  //       id: 2,
  //       name: "Variant 2",
  //       price: 200,
  //     },
  //   ],
  // }
  const [isBuying, setIsBuying] = useState(window.isBuying);
  console.log(product)
  useEffect(() => {
    // Update state whenever window.isBuying changes
    const interval = setInterval(() => {
      setIsBuying(window.isBuying);
    }, 100); // Check for changes every 100ms (or use any desired interval)

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  if (product && !product.available && isBuying) {
    return <NotifyMeForm product={product} />;
  }
  return null;
}

export default App;
