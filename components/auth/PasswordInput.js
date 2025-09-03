'use client';

import { forwardRef, useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordInput = forwardRef(({ value, onChange, onBlur, classes }, ref) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (value) {
      const result = zxcvbn(value);
      setScore(result.score);
    } else {
      setScore(0);
    }
  }, [value]);

  const getColor = () => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getLabel = () => {
    switch (score) {
      case 0:
      case 1:
        return 'Debole';
      case 2:
      case 3:
        return 'Media';
      case 4:
        return 'Forte';
      default:
        return '';
    }
  };

  return (
    <>
      <input
        ref={ref}
        type="password"
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Inserisci password"
        className={classes}
      />

      {value && (
        <>
          <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
            <div
              className={`${getColor()} h-full transition-all duration-300`}
              style={{ width: `${(score + 1) * 20}%` }}
            />
          </div>

          <div className={`font-semibold ${getColor().replace('bg-', 'text-')}`}>{getLabel()}</div>
        </>
      )}
    </>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
