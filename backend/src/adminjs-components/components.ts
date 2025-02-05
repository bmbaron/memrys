import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add('Dashboard', './myDashboard.js')
};

export { componentLoader, Components };
