const LocationCardDetails = ({ text, icon }) => (
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`}>
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 text-stone-900 text-xs font-medium flex items-center justify-center px-2.5 py-1 rounded">
        {icon}
        <u>{text}</u>
    </div>
    </a>
)

export default LocationCardDetails