/**
 * OptionCard
 * Selectable choice tile.
 */
const OptionCard = ({ label, sub, icon, compact, selected, onClick, fullWidth = false }) => {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={[
          'text-center px-4 py-4 rounded-opt border transition-all duration-150 cursor-pointer w-full',
          selected
            ? 'border-brand-gold bg-brand-cream shadow-opt-active scale-[1.02]'
            : 'border-step-border bg-step-card hover:bg-brand-cream hover:border-brand-gold/40',
          fullWidth ? 'col-span-3' : '',
        ].join(' ')}
      >
        <span className="text-base font-bold text-brand-black block">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={[
        'text-left flex flex-col p-5 rounded-card border transition-all duration-200 cursor-pointer w-full h-full relative',
        selected
          ? 'border-brand-gold bg-brand-cream shadow-opt-active scale-[1.02]'
          : 'border-step-border bg-step-card hover:bg-brand-cream hover:border-brand-gold/40',
        fullWidth ? 'col-span-2' : '',
      ].join(' ')}
    >
      {selected && (
        <div className="absolute top-4 right-4 bg-brand-gold text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            <span className="dashicons dashicons-yes !text-[14px] !w-3.5 !h-3.5 !flex !items-center !justify-center !leading-none"></span>
        </div>
      )}
      {icon && (
        <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center mb-5 transition-colors ${selected ? 'bg-brand-gold text-white shadow-md' : 'bg-[#F2EFE8] text-brand-gold'}`}>
            <span className={`dashicons ${icon} !text-[24px] !w-6 !h-6 !flex !items-center !justify-center !leading-none`}></span>
        </div>
      )}
      <div className="mt-auto pt-2 pr-4">
        <span className="text-base font-bold text-brand-black block mb-1">{label}</span>
        {sub && (
          <p className="text-xs text-audit-neutral leading-snug">{sub}</p>
        )}
      </div>
    </button>
  );
};

export default OptionCard;
