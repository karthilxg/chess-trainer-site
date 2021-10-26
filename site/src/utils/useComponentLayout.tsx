import React from "react";

export const useComponentLayout = () => {
  const [layout, setLayout] = React.useState({});

  const onLayout = React.useCallback((event) => {
    const layout = event.nativeEvent.layout;
    setLayout(layout);
  }, []);

  return [layout, onLayout];
};
