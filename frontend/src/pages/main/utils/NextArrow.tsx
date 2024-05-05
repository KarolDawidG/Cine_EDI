import { IconButton } from "@mui/material";
import EastIcon from '@mui/icons-material/East';

export const NextArrow = (props:any) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        className={className}
        style={{ ...style, display: "block", color: "red", position: "absolute", right: -25, zIndex: 1 }}
        onClick={onClick}
      >
        <EastIcon />
      </IconButton>
    );
  }