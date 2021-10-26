import { assign } from "lodash";

export const s = (...args) => assign({}, ...args);

const keyedProp = (key: string) => (x: any) => {
  return {
    [key]: x,
  };
};

const keyedPixelProp = (key: string) => (x: any) => {
  if (typeof x === "number") {
    return {
      [key]: `${x}px`,
    };
  }
  return {
    [key]: x,
  };
};

const keyedPercentProp = (key: string) => (x: number | string | any) => {
  if (typeof x === "number") {
    return {
      [key]: `${x}%`,
    };
  }
  return {
    [key]: x,
  };
};

const hsl = (h: number, s: number, l: number, a?: number) => {
  if (a) {
    return `hsla(${h}, ${s}%, ${l}%, ${a / 100})`;
  } else {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
};

const caps = {
  textTransform: "uppercase",
  letterSpacing: "0.03rem",
};
const p = keyedPixelProp("padding");
const pt = keyedPixelProp("paddingTop");
const pb = keyedPixelProp("paddingBottom");
const pl = keyedPixelProp("paddingLeft");
const pr = keyedPixelProp("paddingRight");
const px = (x) => s(pl(x), pr(x));
const py = (x) => s(pt(x), pb(x));

const m = keyedPixelProp("margin");
const mt = keyedPixelProp("marginTop");
const mb = keyedPixelProp("marginBottom");
const ml = keyedPixelProp("marginLeft");
const mr = keyedPixelProp("marginRight");
const mx = (x) => s(ml(x), mr(x));
const my = (x) => s(mt(x), mb(x));

const weightThin = keyedProp("fontWeight")(300);
const weightRegular = keyedProp("fontWeight")(400);
const weightSemiBold = keyedProp("fontWeight")(500);
const weightBold = keyedProp("fontWeight")(600);

const flexGrow = keyedProp("flexGrow");
const flexStatic = s(keyedProp("flexGrow")(0), keyedProp("flexShrink")(0));
const unshrinkable = keyedProp("flexShrink")(0);
const grow = keyedProp("flexGrow")(1);
const flex = keyedProp("flex");
const textAlign = keyedProp("textAlign");

const pageHeight = keyedProp("minHeight")("100vh");
const fullHeight = keyedProp("height")("100%");
const fullWidth = keyedProp("width")("100%");

const height = keyedPixelProp("height");
const width = keyedPixelProp("width");
const minWidth = keyedPixelProp("minWidth");
const minHeight = keyedPixelProp("minHeight");
const size = (x: string | number) => {
  return s(height(x), width(x));
};

const selfStart = keyedProp("alignSelf")("flex-start");
const selfCenter = keyedProp("alignSelf")("center");
const selfEnd = keyedProp("alignSelf")("flex-end");
const alignStart = keyedProp("alignItems")("flex-start");
const alignEnd = keyedProp("alignItems")("flex-end");
const justifyStart = keyedProp("justifyContent")("flex-start");
const justifyEnd = keyedProp("justifyContent")("flex-end");
const justifyBetween = keyedProp("justifyContent")("space-between");
const alignCenter = keyedProp("alignItems")("center");
const alignStretch = keyedProp("alignItems")("stretch");
const justifyCenter = keyedProp("justifyContent")("center");
const fg = keyedProp("color");
const bg = keyedProp("backgroundColor");

const flexWrap = keyedProp("flexWrap")("wrap");

const display = keyedProp("display");
const displayFlex = keyedProp("display")("flex");
const displayGrid = keyedProp("display")("grid");

const row = s(displayFlex, keyedProp("flexDirection")("row"));
const column = s(displayFlex, keyedProp("flexDirection")("column"));
const absolute = keyedProp("position")("absolute");
const relative = keyedProp("position")("relative");

const border = keyedProp("border");
const borderBottom = keyedProp("borderBottom");
const borderRight = keyedProp("borderRight");

const center = s(alignCenter, justifyCenter, displayFlex);

const br = keyedPixelProp("borderRadius");
const brtl = keyedPixelProp("borderTopLeftRadius");
const brtr = keyedPixelProp("borderTopRightRadius");
const brbl = keyedPixelProp("borderBottomLeftRadius");
const brbr = keyedPixelProp("borderBottomRightRadius");
const brl = (x) => {
  return s(brtl(x), brbl(x));
};
const brr = (x) => s(brtr(x), brbr(x));
const maxWidth = keyedPixelProp("maxWidth");
const maxHeight = keyedPixelProp("maxHeight");
const clickable = keyedProp("cursor")("pointer");
const noBasis = keyedProp("flexBasis")(0);
const round = keyedPixelProp("borderRadius")(999);
const flexible = s(
  keyedProp("flexBasis")(0),
  keyedProp("minWidth")(0),
  keyedProp("minHeight")(0)
);
const fontSize = keyedPixelProp("fontSize");

const noResize = keyedProp("resize")("none");

const opacity = keyedPercentProp("opacity");

const left = keyedPixelProp("left");
const right = keyedPixelProp("right");
const bottom = keyedPixelProp("bottom");
const top = keyedPixelProp("top");

// Compount style objects
const dashboardTitle = s(fontSize(40), weightBold, fg("#2e2e3c"));
const zIndex = keyedProp("zIndex");
const overflowHidden = keyedProp("overflow")("hidden");
const scrollY = keyedProp("overflow-y")("scroll");
const aircamBlue = "#1160d6";
const lineHeight = keyedProp("lineHeight");
const fontFamily = keyedProp("fontFamily");

const shadow = (x, y, blur, spread, color) => {
  return {
    boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`,
  };
};

const white = (opacity: number) => {
  return `hsla(0, 0%, 100%, ${opacity}%)`;
};
const black = (opacity: number) => {
  return `hsla(0, 0%, 0%, ${opacity}%)`;
};

export const c = {
  keyedProp,
  caps,
  p,
  pt,
  pb,
  pl,
  pr,
  px,
  py,
  m,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,
  weightThin,
  weightRegular,
  weightSemiBold,
  weightBold,
  flexGrow,
  flexStatic,
  unshrinkable,
  grow,
  flex,
  textAlign,
  lineHeight,
  pageHeight,
  fullHeight,
  fullWidth,
  height,
  width,
  minWidth,
  minHeight,
  size,
  selfCenter,
  selfStart,
  selfEnd,
  alignStart,
  alignEnd,
  justifyStart,
  justifyEnd,
  justifyBetween,
  alignCenter,
  alignStretch,
  justifyCenter,
  fg,
  bg,
  flexWrap,
  displayFlex,
  displayGrid,
  row,
  column,
  absolute,
  relative,
  border,
  borderBottom,
  borderRight,
  center,
  br,
  brtl,
  brtr,
  brbl,
  brbr,
  brl,
  brr,
  maxWidth,
  maxHeight,
  clickable,
  noBasis,
  round,
  flexible,
  fontSize,
  noResize,
  opacity,
  left,
  right,
  bottom,
  top,
  dashboardTitle,
  zIndex,
  overflowHidden,
  scrollY,
  aircamBlue,
  hsl,
  fontFamily,
  inlineBlock: display("inline-block"),
  whitespace: keyedProp("whiteSpace"),
  shadow,
  stif: (x, styles) => {
    return x ? styles : {};
  },
  transition: (key) => {
    return {
      transition: `250ms ${key} ease-in-out`,
    };
  },
  gradient: (c1, c2, c3) => {
    return {
      background: `linear-gradient(180deg, ${c1} 0%, ${c2} 66%, ${c3} 100%)`,
    };
  },
  white,
  black,
};
