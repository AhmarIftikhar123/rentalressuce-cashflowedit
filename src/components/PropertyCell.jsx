/**
 * PropertyCell
 * Grey info tile used in Step1_Confirm — "BEDROOMS / 4" style.
 */
const PropertyCell = ({ label, value }) => (
  <div className="bg-brand-cream rounded-opt px-4 py-3">
    <p className="text-[10px] font-semibold tracking-widest uppercase text-audit-neutral mb-1">
      {label}
    </p>
    <p className="text-base font-bold text-brand-black">{value || '—'}</p>
  </div>
);

export default PropertyCell;
