import { useState } from 'react';

function Welcome() {
  // State hook - similar to having a class variable in Python
  const [count, setCount] = useState(0);
  
  // Event handler - similar to a method in a Python class
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div className="welcome-container">
      <h1>Welcome to React!</h1>
      <p>You clicked the button {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}

export default Welcome;