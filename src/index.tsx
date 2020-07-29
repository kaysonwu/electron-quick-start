import React, { FC, useEffect } from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';
import './index.less';

const App: FC = props => {
  const currentWindow = remote.getCurrentWindow();

  useEffect(() => {
    currentWindow.on('maximize', () => {
      // When the process is running, if I modify it, a warning will be reported here: 
      // Attempting to call a function in a renderer window that has been closed or released.
      
      console.log('maximized');
    });
  }, []);

  return (
    <div>
      <div className="window-titlebar">
        <span className="window-title">{currentWindow.getTitle()}</span>
        <span className="window-control">
          <span role="button" className="anticon close" onClick={() => currentWindow.destroy()}>
            <svg viewBox="0 0 14 14"  width="1em" height="1em" focusable={false} aria-hidden={true} stroke="currentColor">
              <line x1={0} x2={14} y1={0} y2={14} />
              <line x1={0} x2={14} y1={14} y2={0} />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));