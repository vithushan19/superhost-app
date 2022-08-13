const LocationCardDetails = ({ text, icon }) => (
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`}>
    <span className="bg-gradient-to-r from-gray-100 to-gray-300 text-stone-900 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded mr-2">
        {icon}
        <u>{text}</u>
    </span>
    </a>
)

export default LocationCardDetails