import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width="100%"
      height="100%"
      clipRule="evenodd"
      fillRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M24.959 5.094a2.958 3.316 90 00-3.316 2.958 2.958 3.316 90 003.316 2.959 2.958 3.316 90 003.316-2.959 2.958 3.316 90 00-3.316-2.958z"
        fill="#f0f0f0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        stroke="#3c3c3c"
      />
      <Path
        d="M24.836 5.732c-.376-.21-3.724.806-2.185 3.576-.235-1.545.438-3.203 2.185-3.576z"
        fill="#fff"
      />
      <Path
        d="M24.959 11.011c-6.507 0-9.595 5.884-9.595 10.358h19.263c0-4.474-3.16-10.358-9.668-10.358z"
        fill="#f0f0f0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        stroke="#3c3c3c"
      />
      <Path
        d="M18.161 14.977c1.042-1.478 2.92-3.22 6.84-3.38-.31.277-4.788 1.138-6.84 3.38z"
        fill="#fff"
      />
      <Path
        d="M24.836 5.007s.046.238 0 0c2.48 1.129 2.05 3.847.817 5.547 7.354 3.803 2.213 8.669 2.212 8.668h2.701c1.762 1.287 7.209-2.741-3.835-8.67 3.528-3.115.097-5.606-1.895-5.546z"
        opacity={0.15}
      />
      <Path
        d="M25 15.225c-1.971 0-2.348 2.65-4.137 2.86-1.82.213-3.381-2.312-5.25-1.737-1.495.46-.778 2.6-1.805 3.175-1.402.785-3.185-1.832-5.29-.298 6.838 8.829 8.085 12.377 7.983 18.819h16.998c-.103-6.443 1.144-9.99 7.983-18.82-2.106-1.533-3.889 1.084-5.29.3-1.027-.576-.311-2.716-1.806-3.176-1.868-.575-3.429 1.95-5.25 1.736-1.789-.21-2.166-2.86-4.137-2.86z"
        fill="#f0f0f0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        stroke="#3c3c3c"
      />
      <Path
        d="M9.895 19.34c-.136-.01-.331.056-.458.085 3.081 4.1 6.575 9.537 7.099 12.417-1.407-4.933-3.267-9.562-6.14-12.472z"
        fill="#fff"
      />
      <Path
        d="M39.974 18.735c-9.485 10.003-9.924 17.985-16.941 19.31h10.476c-.103-6.443 1.145-9.99 7.983-18.819 0 0-.688-.756-1.518-.491z"
        opacity={0.15}
      />
      <Path
        d="M14.912 18.945c.203-.088 1.184-1.808 1.98-1.95-1.42-.346-1.618-.046-1.98 1.95zM22.511 17.876c.953-.847 1.633-2.655 3.238-1.845-.798-.23-2.215 1.04-3.238 1.845zM31.12 18.133c.21.07 2.176-1.642 2.862-1.218 0 0-1.43 1.12-2.862 1.218z"
        fill="#fff"
      />
      <Path
        d="M25 36.457s-9.13.048-11.691 1.62c-1.727 1.06-2.135 3.65-1.9 6.323h27.182c.235-2.672-.172-5.264-1.9-6.324-2.56-1.571-11.69-1.62-11.69-1.62z"
        fill="#f0f0f0"
        strokeLinejoin="round"
        strokeWidth={1.2}
        stroke="#3c3c3c"
      />
      <Path
        d="M25 37.147s-8.712-.137-11.624 1.666c-.37.229-.7.84-.954 1.39.261-.331.502-.613.887-.849C15.869 37.783 25 37.734 25 37.734s9.132.049 11.692 1.62c.391.24.593.532.856.87.026-.076-.409-1.158-1.144-1.596C33.648 37.136 25 37.147 25 37.147z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
