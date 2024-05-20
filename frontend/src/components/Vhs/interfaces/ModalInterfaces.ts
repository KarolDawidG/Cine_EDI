import { VHS } from "./VhsInterface";

export interface VHSModalProps {
    open: boolean;
    handleClose: () => void;
    vhs: VHS | null;
    addToCart: (product: VHS, callback: () => void) => void;
  }