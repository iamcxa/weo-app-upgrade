import React from 'react';

import StateMonitor from './StateMonitor';
import LocaleMonitor from './LocaleMonitor';
import NetInfoMonitor from './NetInfoMonitor';

const AppMonitor = () => {
  return (
    <>
      <NetInfoMonitor />
      <LocaleMonitor />
      <StateMonitor />
    </>
  );
};

export default AppMonitor;
