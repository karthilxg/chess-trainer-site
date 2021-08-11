import { useTheme } from "@ui-kitten/components";

const useDesign = () => {
  const theme = useTheme();
  return {
    textPrimary: theme["text-basic-color"],
    textAlternate: theme["color-basic-500"],
    backgroundColor: theme["background-basic-color-4"],
    backgroundColorSecondary: theme["background-basic-color-1"],
  };
};
export default useDesign;
