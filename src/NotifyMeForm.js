import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotifyMeForm.css";

const NotifyMeForm = ({ product }) => {
  const [countryCode, setCountryCode] = useState("+0");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0].title
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const variant = queryParams.get("variant");
    if (variant) {
      const selectedVariant = product.variants.find(
        (v) => v.id === parseInt(variant, 10)
      );
      if (selectedVariant) {
        setSelectedVariant(selectedVariant.title);
        setSelectedVariantId(selectedVariant.id);
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        if (response.data && response.data.country_calling_code) {
          setCountryCode(response.data.country_calling_code);
        }
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };
    fetchCountryCode();
  }, []);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        console.log(data);
    
        const formattedData = data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd?.root +
              (country.idd?.suffixes ? country.idd.suffixes[0] : ""),
            flag: country.flags.png,
          }))
          .filter((item) => item.code); // Filter out countries without codes
    
        // Remove duplicates by code using a Map
        const uniqueData = Array.from(
          new Map(formattedData.map((item) => [item.code, item])).values()
        );
    
        console.log(uniqueData);
        setCountryCodes(uniqueData);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobileNumber) {
      setMessage("Please enter your mobile number.");
      return;
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.id === parseInt(selectedVariantId, 10)
    );

    if (!selectedVariant) {
      setMessage("Selected variant not found.");
      return;
    }

    const dataToSend = {
      country_code: countryCode,
      mobile_number: mobileNumber,
      variantId: selectedVariant.id.toString(), // only send variantId
      productName: `${product.title} - ${selectedVariant.title}`,
      productUrl: window.location.href,
      product_image_url: product.featured_image,
      shop: window.Shopify.shop,
    };

    try {
      await axios.post(
        "https://amusing-sunbird-key.ngrok-free.app/notify-me",
        dataToSend
      );

      setSuccess(true);
      setMessage("");
      setMobileNumber("");
    } catch (error) {
      console.error(error);
      setMessage("There was an error submitting your request.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.isBuying = false;
  };

  return (
    <>
      {isModalOpen && (
        <div className="notify-me-overlay" role="dialog" aria-modal="true">
          <div className="notify-me-modal">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            {success ? (
              <>
                <button class="close-button">&times;</button>
                <br />
                <div className="product-info">
                  <img
                    src={
                      product.featured_image ||
                      "//cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png"
                    }
                    alt={product.title}
                  />
                  <div className="product-details">
                    <span>{product.title}</span>
                    <span>{selectedVariant}</span>
                  </div>
                </div>

                <div class="success-screen">
                  <div class="success-icon">
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
                        fill="#068466"
                      />
                    </svg>
                  </div>
                  <p>We’ll let you know when this product is back in stock</p>
                </div>
                <button class="success-close-button" onClick={closeModal}>Close</button>
              </>
            ) : (
              <>
                <h2>This Product is Out of Stock...</h2>
                <p>We’ll notify you on Whatsapp when it is back in stock.</p>
                <div className="product-info">
                  <img
                    src={
                      product.featured_image ||
                      "//cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_large.png"
                    }
                    alt={product.title}
                  />
                  <div className="product-details">
                    <span>{product.title}</span>
                    <span>{selectedVariant}</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <label>
                    WhatsApp Number:
                    <div className="phone-input">
                      <select
                        id="country-code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        required
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                        maxLength="15"
                        placeholder="Enter your WhatsApp number"
                      />
                    </div>
                  </label>
                  <button type="submit" className="whatsapp-button">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3749 4.09175C14.8166 2.52508 12.7416 1.66675 10.5333 1.66675C5.98325 1.66675 2.27492 5.37508 2.27492 9.92508C2.27492 11.3834 2.65825 12.8001 3.37492 14.0501L2.20825 18.3334L6.58325 17.1834C7.79159 17.8417 9.14992 18.1917 10.5333 18.1917C15.0833 18.1917 18.7916 14.4834 18.7916 9.93342C18.7916 7.72508 17.9333 5.65008 16.3749 4.09175ZM10.5333 16.7917C9.29992 16.7917 8.09159 16.4584 7.03325 15.8334L6.78325 15.6834L4.18325 16.3667L4.87492 13.8334L4.70825 13.5751C4.02492 12.4834 3.65825 11.2167 3.65825 9.92508C3.65825 6.14175 6.74159 3.05841 10.5249 3.05841C12.3583 3.05841 14.0833 3.77508 15.3749 5.07508C16.6749 6.37508 17.3833 8.10008 17.3833 9.93342C17.3999 13.7167 14.3166 16.7917 10.5333 16.7917ZM14.2999 11.6584C14.0916 11.5584 13.0749 11.0584 12.8916 10.9834C12.6999 10.9167 12.5666 10.8834 12.4249 11.0834C12.2833 11.2917 11.8916 11.7584 11.7749 11.8917C11.6583 12.0334 11.5333 12.0501 11.3249 11.9417C11.1166 11.8417 10.4499 11.6167 9.66659 10.9167C9.04992 10.3667 8.64159 9.69175 8.51659 9.48342C8.39992 9.27508 8.49992 9.16675 8.60825 9.05841C8.69992 8.96675 8.81659 8.81675 8.91659 8.70008C9.01659 8.58341 9.05825 8.49175 9.12492 8.35841C9.19159 8.21675 9.15825 8.10008 9.10825 8.00008C9.05825 7.90008 8.64159 6.88342 8.47492 6.46675C8.30825 6.06675 8.13325 6.11675 8.00825 6.10841C7.88325 6.10841 7.74992 6.10841 7.60825 6.10841C7.46659 6.10841 7.24992 6.15841 7.05825 6.36675C6.87492 6.57508 6.34159 7.07508 6.34159 8.09175C6.34159 9.10842 7.08325 10.0917 7.18325 10.2251C7.28325 10.3667 8.64159 12.4501 10.7083 13.3417C11.1999 13.5584 11.5833 13.6834 11.8833 13.7751C12.3749 13.9334 12.8249 13.9084 13.1833 13.8584C13.5833 13.8001 14.4083 13.3584 14.5749 12.8751C14.7499 12.3917 14.7499 11.9834 14.6916 11.8917C14.6333 11.8001 14.5083 11.7584 14.2999 11.6584Z"
                        fill="white"
                      />
                    </svg>
                    WhatsApp me when available
                  </button>
                </form>
              </>
            )}
            {message && <p className="error-message">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default NotifyMeForm;
