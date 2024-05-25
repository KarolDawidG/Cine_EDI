import { Box, Typography, Grid } from "@mui/material";
import selectVHS from "../../../public/select_vhs.jpg";
import receivingVHS from "../../../public/reciving_vhs.jpg";
import loginToWebsite from "../../../public/login_to_website.jpg";

export const RentalProcess = () => {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'black' }}>
        How the Rental Process Works
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img src={loginToWebsite} alt="Login to website" style={{ width: '50%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>1. Registration and Login:</strong> Create an account, verify your email, and log in to access our VHS catalog.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>2. Contact Information:</strong> Fill in your contact details, including your shipping address.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>3. Select and Order VHS Tapes:</strong> Browse our catalog, add tapes to your cart, and place your order. You'll receive a confirmation email.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>4. Order Confirmation and Shipping:</strong> Receive an email confirming your order, followed by a shipping notification with an invoice attached.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={selectVHS} alt="Select VHS tapes" style={{ width: '50%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={receivingVHS} alt="Receiving VHS tapes" style={{ width: '50%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>5. Receive and Pay:</strong> Get your package, pay on delivery, and enjoy your movies for 7 days.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>6. Return Reminder:</strong> Receive a reminder email a few days before the return date.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black', mb: 2 }}>
            <strong>7. Return the Tapes:</strong> Pack the tapes in the original box, use the included return label, and drop them off at the post office.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
