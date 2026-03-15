import { IconName } from "./iconNames.gen";
import { ColorToken } from "../../types/colorTokens";
import { getColorCssVar } from "../../utils/colorUtils";

type SizeProps =
  | {
      size?: never;
      width: number;
      height: number;
    }
  | {
      size: number;
      width?: never;
      height?: never;
    };

type IconProps = {
  name: IconName;
  color: ColorToken;
} & SizeProps;

export const Icon = ({ name, color, size, width, height }: IconProps) => {
  const iconColor = getColorCssVar(color);
  const _width = size ?? width ?? 24;
  const _height = size ?? height ?? 24;

  return (
    <svg style={{ color: iconColor, width, height }} width={_width} height={_height}>
      <use xlinkHref={`/__spritemap#sprite-${name}`} />
    </svg>
  );
};
