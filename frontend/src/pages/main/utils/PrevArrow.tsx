import { IconButton } from "@mui/material";
import WestIcon from '@mui/icons-material/West';

export const PrevArrow = (props:any) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        className={className}
        style={{ ...style, display: "block", color: "red", position: "absolute", left: -40, zIndex: 1 }}
        onClick={onClick}
      >
        <WestIcon />
      </IconButton>
    );
  }