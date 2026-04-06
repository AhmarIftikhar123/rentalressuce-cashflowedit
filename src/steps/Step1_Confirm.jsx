import { useAudit } from '../context/AuditContext';
import ButtonPrimary from '../components/ButtonPrimary';

const StatBox = ({ label, value }) => (
    <div className="bg-[#F9F8F6] p-4 rounded-xl text-center border border-transparent hover:border-[#EAE7DF] transition-colors">
        <span className="block text-[9px] uppercase tracking-widest font-bold text-audit-neutral mb-1">{label}</span>
        <span className="block text-2xl font-black text-brand-black">{value || '—'}</span>
    </div>
);

const Step1_Confirm = () => {
    const { state, goTo } = useAudit();
    const p = state.property;

    return (
        <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-2">
                We found your property
            </h2>
            <p className="text-base text-audit-neutral mb-8">
                Confirm the details below before we continue.
            </p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Visual Left Side */}
                <div className="flex-1 rounded-2xl overflow-hidden relative shadow-md bg-gray-100 min-h-[300px]">
                    <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Property preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-1">Current Selection</p>
                        <h3 className="text-xl font-bold leading-tight">{state.address || '123 Main Street'}</h3>
                    </div>
                </div>

                {/* Data Right Side */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <StatBox label="Bedrooms" value={p.beds} />
                        <StatBox label="Bathrooms" value={p.baths} />
                        <StatBox label="Sq. Footage" value={p.sqft + ' sqft'} />
                        <StatBox label="Garage" value={p.garage} />
                        <StatBox label="Attic" value={p.attic} />
                        <div className="bg-[#FFF8E7] p-4 rounded-xl text-center border border-[#F0E6D2]">
                            <span className="block text-[9px] uppercase tracking-widest font-bold text-[#A67A1A] mb-1">Est. Value</span>
                            <span className="block text-2xl font-black text-[#A67A1A]">${p.estValue?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button 
                            onClick={() => goTo(1.5)}
                            className="flex-1 py-4 text-sm font-bold text-audit-neutral hover:text-brand-black transition-colors rounded-xl border border-step-border hover:bg-gray-50 bg-white shadow-sm"
                        >
                            Edit details
                        </button>
                        <div className="flex-1">
                            <ButtonPrimary onClick={() => goTo(2)} variant="gold">
                                Confirm →
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1_Confirm;
