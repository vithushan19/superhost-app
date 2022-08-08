const CardDetails = ({ text, icon }) => (
    <span className="bg-gradient-to-r from-gray-100 to-gray-300 text-stone-900 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded mr-2">
      {icon}
      {text}
    </span>
)

export default CardDetails