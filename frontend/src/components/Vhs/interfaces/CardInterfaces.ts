import { VHS } from "./VhsInterface";

export interface VHSCardProps {
    vhs: VHS;
    addToCart: (product: VHS) => void;
    handleOpen: (vhs: VHS) => void;
  }