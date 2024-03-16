import PropTypes from "prop-types";

const Tooltip = ({ title, children }) => {
  return (
    <div className="relative inline-block group">
      <div className="inline-block">{children}</div>
      <div className="fixed z-10 px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow opacity-0 invisible transition-opacity duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible">
        {title}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Tooltip;
