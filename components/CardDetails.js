const CardDetails = ({ text, icon }) => (
    <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-slate-900 text-xs font-medium flex items-center justify-center px-2.5 py-1 rounded">
      {icon}
      {text}
    </div>
)

export default CardDetails