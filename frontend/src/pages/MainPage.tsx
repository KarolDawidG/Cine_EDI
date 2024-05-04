import {
    Box,
    Typography,
    Grid,
    Toolbar,
} from "@mui/material";
import MainBar from "../layout/MainBar";
import Footer from "../layout/Footer";
import logo from "../../public/logo2.png";
const MainPage = () => {

    return (
        <Box display="flex" flexDirection="column" >
            <MainBar/>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Toolbar />
                    <Typography>
                        <img src={logo} alt="Logo" width={250} height={250} />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde
                        fugit veniam eius, perspiciatis sunt? Corporis qui ducimus quibusdam,
                        aliquam dolore excepturi quae. Distinctio enim at eligendi perferendis in
                        cum quibusdam sed quae, accusantium et aperiam?
                    </Typography>
                </Grid>
            </Grid>
            <Footer/>
        </Box>
    );
};

export default MainPage;
