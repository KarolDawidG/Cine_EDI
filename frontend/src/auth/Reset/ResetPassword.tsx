import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { PasswordForm } from "./PasswordForm";
import { PasswordStatus } from "./PasswordStatus";
import MainBar from "../../layout/MainBar";
import Footer from "../../layout/Footer";
import { BACKEND } from "../../utils/linkt";
import { notify } from "../../notification/Notify";

export const ResetPassword = () => {
  const [password, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const { id, token } = useParams();
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const redirect = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND}/reset/${id}/${token}`, {
        password,
        password2,
      });

      if (response.status === 200) {
        setTimeout(() => redirect(`/`), 1000);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleResetLink = async () => {
      try {
        const response = await axios.get(`${BACKEND}/reset/${id}/${token}`);
        if (response.status !== 200) {
          notify(response.data.message);
        
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    handleResetLink();
    setPasswordsMatch(password === password2);
  }, [id, token, password, password2]);

  return (
    <Box>
      <MainBar />
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Do you want to reset your password?
          </Typography>

          <form className="form" onSubmit={handleSubmit}>
            <PasswordForm
              password={password}
              setPassword={setPassword1}
              label="Password: "
            />
            <PasswordForm
              password={password2}
              setPassword={setPassword2}
              label="Repeat your password: "
            />
            <Button
              className="btn btn-danger"
              type="submit"
              disabled={!passwordsMatch}
            >
              Reset!
            </Button>
            <PasswordStatus
              password={password}
              password2={password2}
              passwordsMatch={passwordsMatch}
            />
          </form>
        </Paper>
      </Grid>
      <Footer />
    </Box>
  );
};
