import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Grid, Typography, Button, TextField } from "@mui/material";
import Footer from "../../layout/Footer";
import MainBar from "../../layout/MainBar";
import { BACKEND } from "../../utils/linkt";

interface FormState {
  email: string;
}

export const PasswordChangeRequest: React.FC = () => {
  const redirect = useNavigate();
  const [formState, setFormState] = useState<FormState>({
    email: "",
  });
  const [link, setLink] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setLink(`${BACKEND}/reset`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formState, link };
      const response = await axios.post(`${BACKEND}/forgot`, dataToSend);

      if (response.status === 200) {
        setFormState({ email: "" });
        setLink("");
        setTimeout(() => redirect(`/`), 1000);
      } 
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Box>
      <MainBar />
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Do you want to recover your password?
            </Typography>

            <form className="form" onSubmit={handleSubmit}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Enter your e-mail address!
                </Typography>

                <TextField
                  className="form-control"
                  type="email"
                  id="email"
                  placeholder="example@mail.com"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </Paper>
              <Button type="submit">
                Send e-mail!
              </Button>
            </form>
          </Grid>
        </Grid>
      <Footer />
    </Box>
  );
};
