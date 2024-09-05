import React, { forwardRef, useState } from 'react';

// Button Component
const Button = forwardRef(({ className, variant, ...props }, ref) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    default: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600 dark:focus:ring-teal-400",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-400",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-teal-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-teal-400",
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant || 'default']} ${className}`}
      {...props}
    />
  );
});

// Card Components
const Card = ({ className, ...props }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={`px-4 py-3 ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-800 dark:text-white ${className}`} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={`px-4 py-3 ${className}`} {...props} />
);

// ScrollArea Component
const ScrollArea = ({ className, ...props }) => (
  <div className={`overflow-auto ${className}`} {...props} />
);

// Alert Components
const Alert = ({ className, ...props }) => (
  <div className={`bg-gray-100 dark:bg-gray-800 border-l-4 border-teal-500 dark:border-teal-400 p-4 ${className}`} {...props} />
);

const AlertTitle = ({ className, ...props }) => (
  <h4 className={`text-lg font-semibold text-gray-800 dark:text-white mb-2 ${className}`} {...props} />
);

const AlertDescription = ({ className, ...props }) => (
  <p className={`text-gray-600 dark:text-gray-300 ${className}`} {...props} />
);

// Dialog Components
const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </>
  );
};

const DialogTrigger = ({ asChild, children, setIsOpen }) => {
  const handleClick = () => setIsOpen(true);

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  return <button onClick={handleClick}>{children}</button>;
};

const DialogContent = ({ className, children, isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md ${className}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ className, ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={`mt-6 flex justify-end space-x-2 ${className}`} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-800 dark:text-white ${className}`} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
  <p className={`text-gray-600 dark:text-gray-300 mt-2 ${className}`} {...props} />
);

export {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ScrollArea,
  Alert,
  AlertTitle,
  AlertDescription,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};