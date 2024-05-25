import { VHS } from "./VhsInterface";

export interface VHSCardProps {
  vhs: VHS;
  addToCart: (vhs: VHS) => void;
  handleOpen: (vhs: VHS) => void;
  handleAddFavorite: (vhs: VHS) => void;
}
