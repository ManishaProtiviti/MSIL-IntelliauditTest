const CheckCard = ({ check, onToggle, checksDisplay }) => (
  <div
    className={`relative grid row-span-1 box-border border ${
      check.checked
        ? "border-[#012378]"
        : "border-gray-200 hover:border-gray-300"
    } transition-colors rounded-lg overflow-hidden`}
  >
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${check.background})` }}
    />
    <div className="relative box-border p-4 z-10 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <img src={check.icon} alt={check.title} className="w-8 h-8" />
        <input
          type="checkbox"
          disabled={!checksDisplay}
          checked={check.checked}
          onChange={() => onToggle(check.id)}
          className="w-3 h-3 text-[#012386] border-gray-300 rounded focus:ring-[#012386] accent-[#012386]"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-800">{check.title}</h3>
      <p className="text-xs text-gray-600">{check.description}</p>
    </div>
  </div>
);
export default CheckCard;
