import { useState } from "react";

export default function useEditable() {
  const [isEditable, setIsEditable] = useState(false);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsEditable(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsEditable(false);
    }
  };

  return {
    isEditable,
    setIsEditable,
    handleBlur,
    handleKeyDown,
  };
}
