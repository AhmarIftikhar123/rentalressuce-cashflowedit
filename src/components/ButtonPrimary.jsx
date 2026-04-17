/**
 * ButtonPrimary
 * Variants:
 *   'black' (default) — solid dark CTA
 *   'gold'            — gold CTA (Run My Audit, Get Plan)
 *   'outline'         — secondary / Edit button
 *
 * disabled — greys out and blocks clicks.
 */
const ButtonPrimary = ({
  children,
  onClick,
  disabled = false,
  variant = 'black',
  className = '',
  type = 'button',
}) => {
  const base =
    'w-auto py-3.5 px-4 rounded-btn text-sm font-bold tracking-wide transition-all duration-150 active:scale-[0.98] cursor-pointer';

  const variants = {
    black:
      'bg-brand-black text-white hover:bg-brand-black-soft disabled:opacity-50 disabled:cursor-not-allowed',
    gold:
      'bg-brand-gold text-white hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'bg-brand-cream border border-step-border text-brand-black hover:bg-brand-cream-dark disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
