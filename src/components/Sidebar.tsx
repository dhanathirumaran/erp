import { NavLink } from 'react-router-dom';
import { NAVIGATION_LINKS, APP_NAME } from '../constants/navigation';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 px-4 mb-8">{APP_NAME}</h1>
      <nav className="space-y-2">
        {NAVIGATION_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;