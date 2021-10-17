import { useTheme } from "@ui-kitten/components";

const useDesign = () => {
  const theme = useTheme();
  return {
    textPrimary: theme["text-basic-color"],
    textInverse: theme["text-alternate-color"],
    textAlternate: theme["color-basic-500"],
    successColor: theme["color-success-600"],
    failureColor: theme["color-danger-600"],
    failureLight: theme["color-danger-400"],
    backgroundColor: theme["background-basic-color-4"],
    backgroundColorSecondary: theme["background-basic-color-1"],
  };
};
export default useDesign;
