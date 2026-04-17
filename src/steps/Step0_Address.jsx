import { useState } from "@wordpress/element";
import { useAudit } from "../context/AuditContext";
import { lookupProperty } from "../utils/api";
import ButtonPrimary from "../components/ButtonPrimary";

const Step0_Address = () => {
  const { state, update, goTo } = useAudit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    const addr = state.address.trim();
    if (!addr) {
      setError("Please enter a property address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const propertyData = await lookupProperty(addr);
      if (propertyData) {
        // Zillow / dummy path — pre-fill and go to confirm
        update({ property: propertyData });
        goTo(1);
      } else {
        // Google Places path — no property data, go straight to edit
        goTo(1.5);
      }
    } catch (err) {
      setError(err.message ?? "Could not find that address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLookup();
  };

  return (
    <div className="p-8 md:p-12 max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-2">
        What's the property address?
      </h2>
      <p className="text-base text-audit-neutral mb-8">
        Start typing — we'll look up your property automatically.
      </p>

      <div className="relative mb-4">
        {/* Decorative Map Pin Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-audit-neutral opacity-40">
          <span className="dashicons dashicons-location-alt !text-[20px] !w-5 !h-5 !flex !items-center !justify-center !leading-none"></span>
        </div>
        <input
          type="text"
          value={state.address}
          onChange={(e) => update({ address: e.target.value })}
          onKeyDown={handleKey}
          placeholder="456 Maple Ave, Nashville, TN 37201"
          className="w-full pl-12 pr-4 !py-6 rounded-2xl border !border-[#56B7FF] bg-white shadow-sm text-brand-black text-lg placeholder:text-gray-300 transition-all focus:outline-none !focus:border-transparent !focus:border-0"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="text-sm font-semibold text-audit-negative mb-4">
          {error}
        </p>
      )}

      <ButtonPrimary
        onClick={handleLookup}
        disabled={loading || !state.address.trim()}
        variant="gold"
      >
        {loading ? "Looking up property…" : "Look up property →"}
      </ButtonPrimary>
    </div>
  );
};

export default Step0_Address;
